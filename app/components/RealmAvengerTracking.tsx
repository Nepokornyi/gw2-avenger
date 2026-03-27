'use client'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { RealmAvengerResponseSchema } from '../api/avenger/schema'
import { useAuth } from '@/context/AuthContext'
import { getSession, saveSession, clearSession } from '@/lib/local-storage'

type RealmAvengerStats = z.infer<typeof RealmAvengerResponseSchema>

export const RealmAvengerTracking = () => {
    const { user, clearApiKey, ready } = useAuth()
    const [killStats, setKillStats] = useState<RealmAvengerStats | null>(null)

    const [sessionStart, setSessionStart] = useState<number | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [initialKills, setInitialKills] = useState<number | null>(null)
    const [pollingActive, setPollingActive] = useState(false)
    const [pending, setPending] = useState(false)

    useEffect(() => {
        if (!sessionStart) return

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - sessionStart) / 1000))
        }, 1000)

        return () => clearInterval(interval)
    }, [sessionStart])

    useEffect(() => {
        if (!pollingActive) return

        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/avenger', {
                    method: 'POST',
                })

                if (!res.ok) {
                    const data = await res.json()
                    if (data.error === 'key_revoked') {
                        clearApiKey()
                        setPollingActive(false)
                    }
                    throw new Error(data.message ?? 'Polling failed')
                }

                const { avenger } = await res.json()
                setKillStats(avenger)

                const stored = getSession()
                if (stored) {
                    saveSession({ ...stored, currentKills: avenger.current })
                }
            } catch (err) {
                console.error('Polling error:', err)
            }
        }, 180000)

        return () => clearInterval(interval)
    }, [pollingActive, clearApiKey])

    useEffect(() => {
        if (!user?.hasApiKey) return

        const stored = getSession()
        if (!stored) return

        setSessionStart(stored.startedAt)
        setInitialKills(stored.initialKills)
        setKillStats({
            id: stored.achievementId,
            current: stored.currentKills,
            max: stored.maxKills,
            done: false,
        })
        setPollingActive(true)
    }, [user?.hasApiKey])

    const handleStart = async () => {
        setPending(true)

        try {
            const res = await fetch('/api/avenger', {
                method: 'POST',
            })

            if (!res.ok) {
                const data = await res.json()
                if (data.error === 'key_revoked') {
                    clearApiKey()
                }
                throw new Error(data.message ?? 'API unavailable')
            }

            const { avenger } = await res.json()

            const now = Date.now()

            setKillStats(avenger)
            setInitialKills(avenger.current)
            setSessionStart(now)
            setPollingActive(true)

            saveSession({
                startedAt: now,
                initialKills: avenger.current,
                currentKills: avenger.current,
                maxKills: avenger.max,
                achievementId: 283,
            })
        } catch (err) {
            console.error('Request failed', err)
        } finally {
            setPending(false)
        }
    }

    const handleStop = () => {
        setPollingActive(false)
        setSessionStart(null)
        setElapsedTime(0)
        setInitialKills(null)
        setKillStats(null)
        clearSession()
    }

    if (!ready || !user?.hasApiKey) return null

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, '0')
        const m = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${h}:${m}:${s}`
    }

    const sessionKills =
        initialKills !== null && killStats
            ? killStats.current - initialKills
            : 0

    const progress = killStats
        ? Math.min((killStats.current / killStats.max) * 100, 100)
        : 0

    return (
        <div className="animate-fade-in stagger-1 border border-border bg-bg-surface relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-dim to-transparent" />

            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1.5 h-1.5 bg-red" />
                            <h2 className="text-text font-medium tracking-wide uppercase text-sm">
                                Realm Avenger
                            </h2>
                        </div>
                        <p className="text-text-dim text-xs ml-4 uppercase tracking-widest">
                            Achievement #283 — Player Kills
                        </p>
                    </div>

                    {sessionStart && (
                        <div className="animate-fade-in flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-text-dim text-[10px] uppercase tracking-widest mb-0.5">
                                    Session
                                </div>
                                <div className="text-text font-mono text-lg tracking-wider">
                                    {formatTime(elapsedTime)}
                                </div>
                            </div>
                            <button
                                className="group relative bg-transparent border border-red/40 text-red-light text-xs font-medium tracking-wider uppercase px-4 py-1.5 cursor-pointer transition-all duration-300 hover:border-red hover:text-text hover:shadow-[0_0_20px_rgba(170,32,32,0.15)]"
                                onClick={handleStop}
                            >
                                <span className="relative z-10">Stop</span>
                                <div className="absolute inset-0 bg-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </div>
                    )}
                </div>

                {!sessionStart && (
                    <button
                        className="group relative bg-transparent border border-red/40 text-red-light text-sm font-medium tracking-wider uppercase px-6 py-2.5 cursor-pointer transition-all duration-300 hover:border-red hover:text-text hover:shadow-[0_0_20px_rgba(170,32,32,0.15)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        onClick={handleStart}
                        disabled={pending}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {pending && (
                                <span className="inline-block w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                            )}
                            {pending ? 'Starting' : 'Start Session'}
                        </span>
                        <div className="absolute inset-0 bg-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                )}

                {killStats && (
                    <div className="flex flex-col gap-5 animate-fade-in">
                        {/* Progress section */}
                        <div>
                            <div className="flex justify-between text-xs uppercase tracking-widest mb-2">
                                <span className="text-text-muted">
                                    Progress
                                </span>
                                <span className="text-text-muted">
                                    <span className="text-text font-medium">
                                        {killStats.current.toLocaleString()}
                                    </span>
                                    <span className="text-text-dim mx-1">
                                        /
                                    </span>
                                    {killStats.max.toLocaleString()}
                                </span>
                            </div>
                            <div className="h-1 bg-bg-base overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-gold-dim to-gold animate-progress-fill transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Session stats */}
                        {sessionStart && (
                            <div className="grid grid-cols-3 gap-px bg-border">
                                <div className="bg-bg-surface px-4 py-4 animate-fade-in stagger-1">
                                    <div className="text-text-dim text-[10px] uppercase tracking-widest mb-1">
                                        Session Kills
                                    </div>
                                    <div className="text-gold text-2xl font-semibold tabular-nums">
                                        {sessionKills}
                                    </div>
                                </div>
                                <div className="bg-bg-surface px-4 py-4 animate-fade-in stagger-2">
                                    <div className="text-text-dim text-[10px] uppercase tracking-widest mb-1">
                                        Total Kills
                                    </div>
                                    <div className="text-text text-2xl font-semibold tabular-nums">
                                        {killStats.current.toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-bg-surface px-4 py-4 animate-fade-in stagger-3">
                                    <div className="text-text-dim text-[10px] uppercase tracking-widest mb-1">
                                        Remaining
                                    </div>
                                    <div className="text-text-muted text-2xl font-semibold tabular-nums">
                                        {(
                                            killStats.max - killStats.current
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

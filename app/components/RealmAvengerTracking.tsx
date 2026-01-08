'use client'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { RealmAvengerResponseSchema } from '../api/avenger/schema'
import { useApiKey } from '@/context/ApiKeyContext'

type RealmAvengerStats = z.infer<typeof RealmAvengerResponseSchema>

export const RealmAvengerTracking = () => {
    const { apiKey, ready } = useApiKey()
    const [killStats, setKillStats] = useState<RealmAvengerStats | null>(null)

    const [sessionStart, setSessionStart] = useState<number | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [initialKills, setInitialKills] = useState<number | null>(null)
    const [pollingActive, setPollingActive] = useState(false)

    useEffect(() => {
        if (!sessionStart) return

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - sessionStart) / 1000))
        }, 1000)

        return () => clearInterval(interval)
    }, [sessionStart])

    useEffect(() => {
        if (!pollingActive && !apiKey) return

        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/avenger', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey: apiKey }),
                })

                if (!res.ok) throw new Error('Polling failed')

                const { avenger } = await res.json()
                setKillStats(avenger)
            } catch (err) {
                console.error('Polling error:', err)
            }
        }, 180000)

        return () => clearInterval(interval)
    }, [pollingActive, apiKey])

    const handleStart = async () => {
        if (!apiKey) return

        try {
            const res = await fetch('/api/avenger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: apiKey }),
            })

            if (!res.ok) throw new Error('API unavailable')

            const { avenger } = await res.json()

            setKillStats(avenger)
            setInitialKills(avenger.current)
            setSessionStart(Date.now())
            setPollingActive(true)
        } catch (err) {
            console.error('Request failed', err)
        }
    }

    if (!ready || !apiKey) return null

    return (
        <div className="flex flex-col items-center gap-2.5">
            {!sessionStart && (
                <button
                    className="p-2 text-black bg-white cursor-pointer"
                    onClick={handleStart}
                >
                    Start Killing
                </button>
            )}

            {killStats && (
                <div className="flex gap-5">
                    <span>Max kills: {killStats.max}</span>
                    <span className="font-bold">
                        Current kills: {killStats.current}
                    </span>
                </div>
            )}

            {initialKills !== null && killStats && (
                <div>
                    Kills this session: {killStats.current - initialKills}
                </div>
            )}

            {sessionStart && <div>Session time: {elapsedTime}s</div>}
        </div>
    )
}

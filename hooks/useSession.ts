'use client'

import { useCallback, useEffect, useState } from 'react'
import {
    getSession,
    saveSession,
    clearSession,
} from '@/lib/local-storage'
import { type AchievementProgress } from '@/lib/achievements'

type UseSessionOptions = {
    fetchAchievements: () => Promise<AchievementProgress[] | undefined>
    setProgress: (progress: AchievementProgress[]) => void
}

export function useSession({ fetchAchievements, setProgress }: UseSessionOptions) {
    const [sessionStart, setSessionStart] = useState<Map<number, number> | null>(null)
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [pollingActive, setPollingActive] = useState(false)
    const [pending, setPending] = useState(false)

    // Session timer
    useEffect(() => {
        if (!sessionStartTime) return

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000))
        }, 1000)

        return () => clearInterval(interval)
    }, [sessionStartTime])

    // Polling
    useEffect(() => {
        if (!pollingActive) return

        const interval = setInterval(async () => {
            const achievements = await fetchAchievements()
            if (achievements) {
                const stored = getSession()
                if (stored) {
                    saveSession({ ...stored, currentProgress: achievements })
                }
            }
        }, 180000)

        return () => clearInterval(interval)
    }, [pollingActive, fetchAchievements])

    // Restore session from localStorage
    useEffect(() => {
        const stored = getSession()
        if (!stored || !stored.startedAt) return

        setSessionStartTime(stored.startedAt)
        setSessionStart(
            new Map(
                Object.entries(stored.initialProgress).map(([k, v]) => [
                    Number(k),
                    v as number,
                ]),
            ),
        )
        if (stored.currentProgress) {
            setProgress(stored.currentProgress)
        }
        setPollingActive(true)
    }, [setProgress])

    const handleStart = useCallback(async () => {
        setPending(true)

        try {
            const achievements = await fetchAchievements()
            if (!achievements) return

            const now = Date.now()
            const startMap = new Map<number, number>()
            const initialProgress: Record<number, number> = {}

            for (const a of achievements) {
                startMap.set(a.id, a.current)
                initialProgress[a.id] = a.current
            }

            setSessionStart(startMap)
            setSessionStartTime(now)
            setPollingActive(true)

            saveSession({
                startedAt: now,
                initialProgress,
                currentProgress: achievements,
            })
        } catch (err) {
            console.error('Failed to start session:', err)
        } finally {
            setPending(false)
        }
    }, [fetchAchievements])

    const handleStop = useCallback(() => {
        setPollingActive(false)
        setSessionStart(null)
        setSessionStartTime(null)
        setElapsedTime(0)
        clearSession()
    }, [])

    return {
        sessionStart,
        sessionStartTime,
        elapsedTime,
        pending,
        isActive: sessionStartTime !== null,
        handleStart,
        handleStop,
    }
}

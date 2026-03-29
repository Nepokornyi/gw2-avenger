'use client'

import { useCallback, useEffect, useState } from 'react'
import { type AchievementDelta } from '@/lib/achievements'

export type SavedSession = {
    _id: string
    accountId: string
    startedAt: string
    endedAt: string
    achievements: AchievementDelta[]
    notes: string | null
}

export function useSessionHistory() {
    const [sessions, setSessions] = useState<SavedSession[]>([])
    const [loading, setLoading] = useState(true)

    const fetchSessions = useCallback(async () => {
        try {
            const res = await fetch('/api/sessions')
            if (!res.ok) return

            const data = await res.json()
            setSessions(data.sessions)
        } catch (err) {
            console.error('Failed to fetch session history:', err)
        }
    }, [])

    useEffect(() => {
        fetchSessions().finally(() => setLoading(false))
    }, [fetchSessions])

    return { sessions, loading }
}

'use client'

import { useCallback, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { type AchievementProgress } from '@/lib/achievements'

export function useAchievements() {
    const { clearApiKey } = useAuth()
    const [progress, setProgress] = useState<AchievementProgress[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAchievements = useCallback(async () => {
        try {
            const res = await fetch('/api/achievements')

            if (!res.ok) {
                const data = await res.json()
                if (data.error === 'key_revoked') {
                    clearApiKey()
                }
                return undefined
            }

            const data = await res.json()
            setProgress(data.achievements)
            return data.achievements as AchievementProgress[]
        } catch (err) {
            console.error('Failed to fetch achievements:', err)
            return undefined
        }
    }, [clearApiKey])

    return { progress, setProgress, loading, setLoading, fetchAchievements }
}

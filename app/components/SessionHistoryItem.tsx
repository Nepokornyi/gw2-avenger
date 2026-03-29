'use client'

import { useState } from 'react'
import { type SavedSession } from '@/hooks/useSessionHistory'
import { getAchievementNameById, GROUP_COLORS } from '@/lib/achievements'
import { Card } from '@/components/Card'

type Props = {
    session: SavedSession
}

function formatDuration(startedAt: string, endedAt: string): string {
    const ms = new Date(endedAt).getTime() - new Date(startedAt).getTime()
    const totalMinutes = Math.floor(ms / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export const SessionHistoryItem = ({ session }: Props) => {
    const [expanded, setExpanded] = useState(false)

    const totalDelta = session.achievements.reduce(
        (sum, a) => sum + (a.endValue - a.startValue),
        0,
    )

    return (
        <Card>
            <button
                className="w-full text-left cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div>
                            <div className="text-text text-base font-medium">
                                {formatDate(session.startedAt)}
                            </div>
                            <div className="text-text-dim text-sm">
                                {formatDuration(session.startedAt, session.endedAt)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-gold text-base font-semibold tabular-nums">
                            +{totalDelta.toLocaleString()}
                        </div>
                        <span className={`text-text-dim text-sm transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                            ▾
                        </span>
                    </div>
                </div>

                {session.notes && (
                    <p className="text-text-muted text-sm mt-2">{session.notes}</p>
                )}
            </button>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2 animate-fade-in">
                    {session.achievements.map((a) => {
                        const info = getAchievementNameById(a.achievementId)
                        const name = info?.name ?? `Achievement #${a.achievementId}`
                        const colors = info ? GROUP_COLORS[info.group] : null
                        const delta = a.endValue - a.startValue

                        return (
                            <div
                                key={a.achievementId}
                                className="flex items-center justify-between text-sm"
                            >
                                <span className="text-text-muted">{name}</span>
                                <div className="flex items-center gap-4 tabular-nums">
                                    <span className="text-text-dim">
                                        {a.startValue.toLocaleString()} → {a.endValue.toLocaleString()}
                                    </span>
                                    <span className={`font-semibold ${colors?.accent ?? 'text-gold'}`}>
                                        +{delta.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </Card>
    )
}

'use client'

import {
    type Achievement,
    type AchievementProgress,
    resolveAchievement,
    GROUP_COLORS,
} from '@/lib/achievements'
import { Card } from '@/components/Card'

type Props = {
    achievement: Achievement
    progress: AchievementProgress[]
    sessionStart: Map<number, number> | null
}

export const AchievementCard = ({
    achievement,
    progress,
    sessionStart,
}: Props) => {
    const resolved = resolveAchievement(achievement, progress)
    const colors = GROUP_COLORS[achievement.group]
    const pct =
        resolved.max > 0
            ? Math.min((resolved.current / resolved.max) * 100, 100)
            : 0

    const startValue = sessionStart?.get(resolved.activeId) ?? null
    const delta = startValue !== null ? resolved.current - startValue : null
    const accentVia = colors.barTo.replace('to-', 'via-') + ' opacity-50'

    return (
        <Card
            accentColor={accentVia}
            className={resolved.done ? colors.glowClass : ''}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="font-display text-text font-medium tracking-wide text-base">
                            {resolved.name}
                        </h3>
                    </div>
                    <p className="text-text-dim text-sm uppercase tracking-widest">
                        {achievement.description}
                    </p>
                </div>

                {delta !== null && delta > 0 && (
                    <div
                        className={`${colors.accent} text-lg font-semibold tabular-nums animate-fade-in`}
                    >
                        +{delta.toLocaleString()}
                    </div>
                )}
            </div>

            {/* Progress bar */}
            <div className="mb-2">
                <div className="flex justify-between text-sm uppercase tracking-widest mb-2">
                    <span className="text-text-muted">
                        {resolved.done ? 'Complete' : `${pct.toFixed(1)}%`}
                    </span>
                    <span className="text-text-muted tabular-nums">
                        <span className="text-text font-medium">
                            {resolved.current.toLocaleString()}
                        </span>
                        <span className="text-text-dim mx-1">/</span>
                        {resolved.max.toLocaleString()}
                    </span>
                </div>
                <div className="h-2 bg-bg-base overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${colors.barFrom} ${colors.barTo} animate-progress-fill transition-all duration-1000 relative overflow-hidden`}
                        style={{ width: `${pct}%` }}
                    >
                        {/* Shimmer sweep */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            style={{
                                animation: 'shimmer 3s ease-in-out infinite',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Session values */}
            {startValue !== null && (
                <div className="flex gap-6 mt-4 pt-4 border-t border-border text-sm">
                    <div>
                        <span className="text-text-dim uppercase tracking-widest">
                            Start{' '}
                        </span>
                        <span className="text-text-muted tabular-nums">
                            {startValue.toLocaleString()}
                        </span>
                    </div>
                    <div>
                        <span className="text-text-dim uppercase tracking-widest">
                            Current{' '}
                        </span>
                        <span className="text-text tabular-nums">
                            {resolved.current.toLocaleString()}
                        </span>
                    </div>
                </div>
            )}
        </Card>
    )
}

'use client'

import {
    GROUP_CONFIG,
    getAchievementsByGroup,
    type AchievementGroup,
} from '@/lib/achievements'
import { useAchievements } from '@/hooks/useAchievements'
import { useSession } from '@/hooks/useSession'
import { AchievementCard } from './AchievementCard'
import { SessionBar } from './SessionBar'
import { SectionHeading } from '@/components/SectionHeading'

const GROUPS: AchievementGroup[] = ['combat', 'captures', 'defenses', 'supply']

export const Dashboard = () => {
    const { progress, setProgress, loading, fetchAchievements } =
        useAchievements()

    const session = useSession({ fetchAchievements, setProgress })

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <span className="inline-block w-5 h-5 border-2 border-gold-dim border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <SessionBar
                isActive={session.isActive}
                elapsedTime={session.elapsedTime}
                pending={session.pending}
                onStart={session.handleStart}
                onStop={session.handleStop}
            />

            {GROUPS.map((group) => {
                const achievements = getAchievementsByGroup(group)
                if (achievements.length === 0) return null
                const config = GROUP_CONFIG[group]

                return (
                    <div key={group} className="animate-fade-in">
                        <SectionHeading color={config.accent}>
                            {config.label}
                        </SectionHeading>

                        <div
                            className={`grid ${group === 'combat' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-3`}
                        >
                            {achievements.map((a) => (
                                <AchievementCard
                                    key={a.name}
                                    achievement={a}
                                    progress={progress}
                                    sessionStart={session.sessionStart}
                                />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

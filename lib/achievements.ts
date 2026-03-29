export type AchievementGroup = 'combat' | 'captures' | 'defenses' | 'supply'

type SingleAchievement = {
    type: 'single'
    id: number
    name: string
    description: string
    group: AchievementGroup
}

type ChainAchievement = {
    type: 'chain'
    name: string
    description: string
    group: AchievementGroup
    tiers: { id: number; name: string }[]
}

export type Achievement = SingleAchievement | ChainAchievement

export const GROUP_CONFIG: Record<
    AchievementGroup,
    { label: string; accent: string; accentDim: string }
> = {
    combat: {
        label: 'Combat',
        accent: 'text-red-light',
        accentDim: 'text-red',
    },
    captures: {
        label: 'Objectives — Captures',
        accent: 'text-green',
        accentDim: 'text-green-dim',
    },
    defenses: {
        label: 'Objectives — Defenses',
        accent: 'text-blue',
        accentDim: 'text-blue-dim',
    },
    supply: {
        label: 'Supply & Logistics',
        accent: 'text-amber',
        accentDim: 'text-amber-dim',
    },
}

export const WVW_ACHIEVEMENTS: Achievement[] = [
    {
        type: 'chain',
        name: 'Realm Avenger',
        description: 'Player kills',
        group: 'combat',
        tiers: [
            { id: 283, name: 'Realm Avenger' },
            { id: 7911, name: 'Realm Avenger II' },
            { id: 7855, name: 'Realm Avenger III' },
            { id: 7932, name: 'Realm Avenger IV' },
            { id: 7870, name: 'Realm Avenger V' },
            { id: 7906, name: 'Realm Avenger VI' },
            { id: 7924, name: 'Realm Avenger VII' },
            { id: 7858, name: 'Realm Avenger VIII' },
            { id: 7912, name: 'Realm Avenger IX' },
            { id: 7885, name: 'Realm Avenger X' },
        ],
    },
    {
        type: 'single',
        id: 291,
        name: 'Going Camping',
        description: 'Camp captures',
        group: 'captures',
    },
    {
        type: 'single',
        id: 297,
        name: "It's Quite Roomy in Here",
        description: 'Tower captures',
        group: 'captures',
    },
    {
        type: 'single',
        id: 300,
        name: 'All We See, We Own',
        description: 'Keep captures',
        group: 'captures',
    },
    {
        type: 'single',
        id: 319,
        name: 'Stay Out!',
        description: 'All objective defenses',
        group: 'defenses',
    },
    {
        type: 'single',
        id: 285,
        name: "A Pack Dolyak's Best Friend",
        description: 'Dolyak escorts',
        group: 'supply',
    },
    {
        type: 'single',
        id: 288,
        name: 'Yakslapper',
        description: 'Caravan kills',
        group: 'supply',
    },
]

export function getAllAchievementIds(): number[] {
    return WVW_ACHIEVEMENTS.flatMap((a) =>
        a.type === 'chain' ? a.tiers.map((t) => t.id) : [a.id],
    )
}

export function getAchievementsByGroup(group: AchievementGroup): Achievement[] {
    return WVW_ACHIEVEMENTS.filter((a) => a.group === group)
}

export type AchievementProgress = {
    id: number
    current: number
    max: number
    done: boolean
}

export type AchievementDelta = {
    achievementId: number
    startValue: number
    endValue: number
}

export type ResolvedAchievement = {
    name: string
    current: number
    max: number
    done: boolean
    tierLabel: string | null
    activeId: number
}

export function resolveAchievement(
    achievement: Achievement,
    progress: AchievementProgress[],
): ResolvedAchievement {
    if (achievement.type === 'single') {
        const p = progress.find((p) => p.id === achievement.id)
        return {
            name: achievement.name,
            current: p?.current ?? 0,
            max: p?.max ?? 1,
            done: p?.done ?? false,
            tierLabel: null,
            activeId: achievement.id,
        }
    }

    for (const tier of achievement.tiers) {
        const p = progress.find((pr) => pr.id === tier.id)
        if (!p || !p.done) {
            return {
                name: tier.name,
                current: p?.current ?? 0,
                max: p?.max ?? 1,
                done: false,
                tierLabel:
                    tier.name.replace(achievement.name, '').trim() || 'I',
                activeId: tier.id,
            }
        }
    }

    const lastTier = achievement.tiers[achievement.tiers.length - 1]
    const lastProgress = progress.find((p) => p.id === lastTier.id)
    return {
        name: lastTier.name,
        current: lastProgress?.max ?? 0,
        max: lastProgress?.max ?? 1,
        done: true,
        tierLabel: 'Complete',
        activeId: lastTier.id,
    }
}

export const GROUP_COLORS: Record<
    AchievementGroup,
    { barFrom: string; barTo: string; accent: string; accentDim: string }
> = {
    combat: {
        barFrom: 'from-red/80',
        barTo: 'to-red-light',
        accent: 'text-red-light',
        accentDim: 'text-red',
    },
    captures: {
        barFrom: 'from-green-dim',
        barTo: 'to-green',
        accent: 'text-green',
        accentDim: 'text-green-dim',
    },
    defenses: {
        barFrom: 'from-blue-dim',
        barTo: 'to-blue',
        accent: 'text-blue',
        accentDim: 'text-blue-dim',
    },
    supply: {
        barFrom: 'from-amber-dim',
        barTo: 'to-amber',
        accent: 'text-amber',
        accentDim: 'text-amber-dim',
    },
}

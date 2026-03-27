type SingleAchievement = {
    type: 'single'
    id: number
    name: string
    description: string
}

type ChainAchievement = {
    type: 'chain'
    name: string
    description: string
    tiers: { id: number; name: string }[]
}

export type Achievement = SingleAchievement | ChainAchievement

export const WVW_ACHIEVEMENTS: Achievement[] = [
    {
        type: 'chain',
        name: 'Realm Avenger',
        description: 'Player kills',
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
    },
    {
        type: 'single',
        id: 297,
        name: "It's Quite Roomy in Here",
        description: 'Tower captures',
    },
    {
        type: 'single',
        id: 300,
        name: 'All We See, We Own',
        description: 'Keep captures',
    },
    {
        type: 'single',
        id: 319,
        name: 'Stay Out!',
        description: 'All objective defenses',
    },
    {
        type: 'single',
        id: 285,
        name: "A Pack Dolyak's Best Friend",
        description: 'Dolyak escorts',
    },
    {
        type: 'single',
        id: 288,
        name: 'Yakslapper',
        description: 'Caravan kills',
    },
]

export function getAllAchievementIds(): number[] {
    return WVW_ACHIEVEMENTS.flatMap((a) =>
        a.type === 'chain' ? a.tiers.map((t) => t.id) : [a.id],
    )
}

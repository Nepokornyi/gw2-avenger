import { z } from 'zod'

export const AchievementProgressSchema = z.object({
    id: z.number(),
    current: z.number(),
    max: z.number(),
    done: z.boolean(),
})

export const AchievementsResponseSchema = z.array(AchievementProgressSchema)

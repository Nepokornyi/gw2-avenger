import { z } from 'zod'

export const SessionAchievementSchema = z.object({
    achievementId: z.number(),
    startValue: z.number(),
    endValue: z.number(),
})

export const CreateSessionSchema = z.object({
    startedAt: z.number(),
    achievements: z.array(SessionAchievementSchema).min(1),
    notes: z.string().nullable().optional(),
})

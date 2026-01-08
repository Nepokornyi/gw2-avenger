import { z } from 'zod'

export const KillerRequestSchema = z.object({
    apiKey: z.string().min(1),
})

export const KillerResponseSchema = z.object({
    id: z.number(),
    current: z.number(),
    max: z.number(),
    done: z.boolean(),
})

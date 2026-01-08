import { z } from 'zod'

export const RealmAvengerRequestSchema = z.object({
    apiKey: z.string().min(1),
})

export const RealmAvengerResponseSchema = z.object({
    id: z.number(),
    current: z.number(),
    max: z.number(),
    done: z.boolean(),
})

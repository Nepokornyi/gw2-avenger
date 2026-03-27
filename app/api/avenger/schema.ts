import { z } from 'zod'

export const RealmAvengerResponseSchema = z.object({
    id: z.number(),
    current: z.number(),
    max: z.number(),
    done: z.boolean(),
})

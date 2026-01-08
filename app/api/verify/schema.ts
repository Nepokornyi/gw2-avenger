import { z } from 'zod'

export const Gw2AccountSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        wvw_rank: z.number(),
    })
    .loose()

export const VerifyKeyRequestSchema = z.object({
    apiKey: z.string().min(1),
})

export const VerifyKeyResponseSchema = z.object({
    valid: z.boolean(),
    account: Gw2AccountSchema.optional(),
})

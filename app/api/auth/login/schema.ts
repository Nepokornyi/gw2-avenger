import { z } from 'zod'

export const LoginRequestSchema = z.object({
    apiKey: z.string().min(1),
})

export const Gw2AccountSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        wvw_rank: z.number(),
    })
    .loose()

export const Gw2TokenInfoSchema = z
    .object({
        name: z.string(),
        permissions: z.array(z.string()),
    })
    .loose()

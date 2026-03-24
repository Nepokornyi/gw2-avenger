import { z } from 'zod'

const GW2_API_BASE = 'https://api.guildwars2.com'

export class Gw2ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message)
    }
}

export async function gw2Fetch<T extends z.ZodType>(
    apiKey: string,
    endpoint: string,
    schema: T
): Promise<z.infer<T>> {
    const res = await fetch(`${GW2_API_BASE}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    })

    if (!res.ok) {
        let message = `GW2 API error: ${res.status}`
        try {
            const body = await res.json()
            if (body.text) message = body.text
        } catch {
            // response may not be JSON (e.g. 5xx HTML errors)
        }
        throw new Gw2ApiError(res.status, message)
    }

    const data = await res.json()
    return schema.parse(data)
}

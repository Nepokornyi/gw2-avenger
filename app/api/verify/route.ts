import { Gw2AccountSchema, VerifyKeyRequestSchema } from './schema'
import { gw2Fetch, Gw2ApiError } from '@/lib/gw2-api'

export async function POST(req: Request) {
    try {
        const body = VerifyKeyRequestSchema.parse(await req.json())
        const account = await gw2Fetch(body.apiKey, '/v2/account', Gw2AccountSchema)

        return Response.json({ valid: true, account })
    } catch (err) {
        if (err instanceof Gw2ApiError) {
            return Response.json(
                { valid: false, message: err.message },
                { status: err.status }
            )
        }

        console.error('GW2 Verification failed: ', err)
        return Response.json({ valid: false }, { status: 400 })
    }
}

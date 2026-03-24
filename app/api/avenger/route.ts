import { RealmAvengerRequestSchema, RealmAvengerResponseSchema } from './schema'
import { gw2Fetch, Gw2ApiError } from '@/lib/gw2-api'

export async function POST(req: Request) {
    try {
        const body = RealmAvengerRequestSchema.parse(await req.json())
        const avenger = await gw2Fetch(
            body.apiKey,
            '/v2/account/achievements?id=283',
            RealmAvengerResponseSchema
        )

        return Response.json({ avenger })
    } catch (err) {
        if (err instanceof Gw2ApiError) {
            return Response.json(
                { message: err.message },
                { status: err.status }
            )
        }

        console.error('GW2 Verification failed: ', err)
        return Response.json({ status: 400 })
    }
}

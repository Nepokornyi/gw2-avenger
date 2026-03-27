import { RealmAvengerResponseSchema } from './schema'
import { gw2Fetch, Gw2ApiError } from '@/lib/gw2-api'
import { getUserFromRequest } from '@/lib/auth'

export async function POST() {
    try {
        const user = await getUserFromRequest()

        if (!user || !user.apiKey) {
            return Response.json(
                { message: 'Not authenticated or missing API key' },
                { status: 401 },
            )
        }

        const avenger = await gw2Fetch(
            user.apiKey as string,
            '/v2/account/achievements?id=283',
            RealmAvengerResponseSchema,
        )

        return Response.json({ avenger })
    } catch (err) {
        if (err instanceof Gw2ApiError) {
            return Response.json(
                { message: err.message },
                { status: err.status },
            )
        }

        console.error('GW2 Verification failed: ', err)
        return Response.json({ message: 'Request failed' }, { status: 400 })
    }
}

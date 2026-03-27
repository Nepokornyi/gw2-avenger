import { RealmAvengerResponseSchema } from './schema'
import { gw2Fetch, Gw2ApiError } from '@/lib/gw2-api'
import { getUserFromRequest, handleGw2ApiError } from '@/lib/auth'

export async function POST() {
    const user = await getUserFromRequest()

    if (!user || !user.apiKey) {
        return Response.json(
            { message: 'Not authenticated or missing API key' },
            { status: 401 },
        )
    }

    try {
        const avenger = await gw2Fetch(
            user.apiKey as string,
            '/v2/account/achievements?id=283',
            RealmAvengerResponseSchema,
        )

        return Response.json({ avenger })
    } catch (err) {
        if (err instanceof Gw2ApiError) {
            const result = await handleGw2ApiError(
                user.accountId as string,
                err,
            )
            return Response.json(
                { error: result.error, message: result.message },
                { status: result.status },
            )
        }

        console.error('Avenger fetch failed:', err)
        return Response.json({ message: 'Request failed' }, { status: 400 })
    }
}

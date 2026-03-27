import { getUserFromRequest, handleGw2ApiError } from '@/lib/auth'
import { gw2Fetch, Gw2ApiError } from '@/lib/gw2-api'
import { getAllAchievementIds } from '@/lib/achievements'
import { AchievementsResponseSchema } from './schema'

export async function GET() {
    const user = await getUserFromRequest()

    if (!user || !user.apiKey) {
        return Response.json(
            { message: 'Not authenticated or missing API key' },
            { status: 401 },
        )
    }

    const ids = getAllAchievementIds()

    try {
        const achievements = await gw2Fetch(
            user.apiKey as string,
            `/v2/account/achievements?ids=${ids.join(',')}`,
            AchievementsResponseSchema,
        )

        return Response.json({ achievements })
    } catch (err) {
        if (err instanceof Gw2ApiError) {
            // 404 = no progress on any requested achievement
            if (err.status === 404) {
                return Response.json({ achievements: [] })
            }

            const result = await handleGw2ApiError(
                user.accountId as string,
                err,
            )
            return Response.json(
                { error: result.error, message: result.message },
                { status: result.status },
            )
        }

        console.error('Achievements fetch failed:', err)
        return Response.json({ message: 'Request failed' }, { status: 500 })
    }
}

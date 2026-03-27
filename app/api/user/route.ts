import { getUserFromRequest } from '@/lib/auth'

export async function GET() {
    const user = await getUserFromRequest()

    if (!user) {
        return Response.json(
            { error: 'not_authenticated', message: 'Not logged in' },
            { status: 401 },
        )
    }

    return Response.json({
        accountId: user.accountId,
        accountName: user.accountName,
        wvwRank: user.wvwRank,
        hasApiKey: user.apiKey !== null,
    })
}

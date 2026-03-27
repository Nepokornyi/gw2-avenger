import { gw2Fetch, Gw2ApiError } from '@/lib/gw2-api'
import { setAuthCookie } from '@/lib/auth'
import { getDatabase, createUserIndexes } from '@/lib/mongodb'
import {
    LoginRequestSchema,
    Gw2AccountSchema,
    Gw2TokenInfoSchema,
} from './schema'

const REQUIRED_PERMISSIONS = ['account', 'progression']

export async function POST(req: Request) {
    try {
        const body = LoginRequestSchema.parse(await req.json())

        // 1. Validate key against GW2 account
        const account = await gw2Fetch(
            body.apiKey,
            '/v2/account',
            Gw2AccountSchema,
        )

        // 2. Check permissions
        const tokenInfo = await gw2Fetch(
            body.apiKey,
            '/v2/tokeninfo',
            Gw2TokenInfoSchema,
        )
        const missing = REQUIRED_PERMISSIONS.filter(
            (p) => !tokenInfo.permissions.includes(p),
        )

        const db = await getDatabase()
        await createUserIndexes(db)
        const users = db.collection('users')
        const now = new Date()

        if (missing.length > 0) {
            // Key is valid but missing permissions — create user without key
            await users.updateOne(
                { accountId: account.id },
                {
                    $set: {
                        accountName: account.name,
                        wvwRank: account.wvw_rank,
                        updatedAt: now,
                    },
                    $setOnInsert: {
                        accountId: account.id,
                        apiKey: null,
                        createdAt: now,
                    },
                },
                { upsert: true },
            )

            return Response.json(
                {
                    error: 'missing_permissions',
                    message: `API key is missing required permissions: ${missing.join(', ')}. Create a new key at account.arena.net with "account" and "progression" checked.`,
                },
                { status: 403 },
            )
        }

        // 3. Upsert user with key
        await users.updateOne(
            { accountId: account.id },
            {
                $set: {
                    accountName: account.name,
                    apiKey: body.apiKey,
                    wvwRank: account.wvw_rank,
                    updatedAt: now,
                },
                $setOnInsert: { accountId: account.id, createdAt: now },
            },
            { upsert: true },
        )

        // 4. Set auth cookie
        await setAuthCookie(account.id)

        return Response.json({
            accountId: account.id,
            accountName: account.name,
            wvwRank: account.wvw_rank,
            hasApiKey: true,
        })
    } catch (err) {
        if (err instanceof Gw2ApiError) {
            return Response.json(
                { error: 'gw2_api_error', message: err.message },
                { status: err.status },
            )
        }

        console.error('Login failed:', err)
        return Response.json(
            { error: 'internal', message: 'Login failed' },
            { status: 500 },
        )
    }
}

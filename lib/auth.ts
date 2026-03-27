import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getDatabase } from './mongodb'
import { Gw2ApiError } from './gw2-api'

const COOKIE_NAME = 'gw2-session'

function getSecret() {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('Missing JWT_SECRET environment variable.')
    return new TextEncoder().encode(secret)
}

export async function signToken(accountId: string): Promise<string> {
    return new SignJWT({ accountId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .sign(getSecret())
}

export async function verifyToken(token: string): Promise<string> {
    const { payload } = await jwtVerify(token, getSecret())
    return payload.accountId as string
}

export async function setAuthCookie(accountId: string) {
    const token = await signToken(accountId)
    const cookieStore = await cookies()

    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    })
}

export async function getUserFromRequest() {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) return null

    try {
        const accountId = await verifyToken(token)
        const db = await getDatabase()
        return db.collection('users').findOne({ accountId })
    } catch {
        return null
    }
}

const GW2_API_HEALTH = 'https://api.guildwars2.com/v2.json'

export async function handleGw2ApiError(
    accountId: string,
    error: Gw2ApiError,
): Promise<{ error: string; message: string; status: number }> {
    if (error.status === 401) {
        const db = await getDatabase()
        await db.collection('users').updateOne(
            { accountId },
            { $set: { apiKey: null, updatedAt: new Date() } },
        )
        return {
            error: 'key_revoked',
            message:
                'API key is no longer valid — please add a new one.',
            status: 401,
        }
    }

    if (error.status >= 500) {
        try {
            const res = await fetch(GW2_API_HEALTH)
            if (!res.ok) throw new Error()
            return { error: 'gw2_error', message: error.message, status: error.status }
        } catch {
            return {
                error: 'gw2_down',
                message: 'GW2 API is unavailable.',
                status: 503,
            }
        }
    }

    return { error: 'gw2_error', message: error.message, status: error.status }
}

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getDatabase } from './mongodb'

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

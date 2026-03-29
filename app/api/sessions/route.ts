import { getUserFromRequest } from '@/lib/auth'
import { getDatabase, createSessionIndexes } from '@/lib/mongodb'
import { CreateSessionSchema } from './schema'

export async function POST(req: Request) {
    const user = await getUserFromRequest()

    if (!user) {
        return Response.json(
            { message: 'Not authenticated' },
            { status: 401 },
        )
    }

    try {
        const body = CreateSessionSchema.parse(await req.json())

        const db = await getDatabase()
        await createSessionIndexes(db)
        const sessions = db.collection('sessions')

        const doc = {
            accountId: user.accountId as string,
            startedAt: new Date(body.startedAt),
            endedAt: new Date(),
            achievements: body.achievements,
            notes: body.notes ?? null,
        }

        const result = await sessions.insertOne(doc)

        return Response.json({
            id: result.insertedId,
            ...doc,
        })
    } catch (err) {
        console.error('Failed to create session:', err)
        return Response.json(
            { message: 'Failed to save session' },
            { status: 400 },
        )
    }
}

export async function GET() {
    const user = await getUserFromRequest()

    if (!user) {
        return Response.json(
            { message: 'Not authenticated' },
            { status: 401 },
        )
    }

    try {
        const db = await getDatabase()
        const sessions = db.collection('sessions')

        const results = await sessions
            .find({ accountId: user.accountId as string })
            .sort({ startedAt: -1 })
            .limit(50)
            .toArray()

        return Response.json({ sessions: results })
    } catch (err) {
        console.error('Failed to fetch sessions:', err)
        return Response.json(
            { message: 'Failed to fetch sessions' },
            { status: 500 },
        )
    }
}

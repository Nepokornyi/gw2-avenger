import { getDatabase } from '@/lib/mongodb'

export async function GET() {
    try {
        const db = await getDatabase()
        await db.command({ ping: 1 })

        return Response.json({
            ok: true,
            db: db.databaseName,
            message: 'MongoDB connection is healthy',
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown MongoDB error'

        console.error('MongoDB health check failed:', error)

        return Response.json(
            {
                ok: false,
                error: message,
            },
            { status: 500 }
        )
    }
}

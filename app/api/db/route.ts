import { getMongoClient, getDatabase } from '@/lib/mongodb'

export async function GET() {
    try {
        const client = await getMongoClient()
        const db = await getDatabase()

        // 1. Ping to confirm connection
        await db.command({ ping: 1 })

        // 2. List all databases in the cluster
        const admin = client.db().admin()
        const { databases } = await admin.listDatabases()

        // 3. List collections in the current database
        const collections = await db.listCollections().toArray()

        // 4. Get server build info (version, modules, etc.)
        const buildInfo = await admin.serverInfo()

        // 5. Get server status (connections, memory, uptime)
        const serverStatus = await admin.serverStatus()

        return Response.json({
            ok: true,
            currentDatabase: db.databaseName,
            databases: databases.map((d) => ({
                name: d.name,
                sizeOnDisk: d.sizeOnDisk,
                empty: d.empty,
            })),
            collections: collections.map((c) => ({
                name: c.name,
                type: c.type,
            })),
            server: {
                version: buildInfo.version,
                modules: buildInfo.modules,
                host: serverStatus.host,
                uptime: serverStatus.uptime,
                connections: serverStatus.connections,
            },
        })
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Unknown MongoDB error'

        console.error('MongoDB health check failed:', error)

        return Response.json(
            {
                ok: false,
                error: message,
            },
            { status: 500 },
        )
    }
}

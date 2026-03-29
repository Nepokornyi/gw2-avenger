import { Db, MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI.')
}
const mongoUri: string = uri

type MongoCache = {
    client: MongoClient | null
    promise: Promise<MongoClient> | null
}

declare global {
    var __mongoCache: MongoCache | undefined
}

const globalCache = globalThis.__mongoCache ?? { client: null, promise: null }

globalThis.__mongoCache = globalCache

async function connectClient() {
    const client = new MongoClient(mongoUri)
    globalCache.promise = client.connect()
    globalCache.client = await globalCache.promise
    return globalCache.client
}

function resetCache() {
    globalCache.client = null
    globalCache.promise = null
}

export async function getMongoClient() {
    if (globalCache.client) {
        try {
            await globalCache.client.db().command({ ping: 1 })
            return globalCache.client
        } catch {
            resetCache()
        }
    }

    if (globalCache.promise) {
        try {
            globalCache.client = await globalCache.promise
            return globalCache.client
        } catch {
            resetCache()
        }
    }

    return connectClient()
}

export async function getDatabase(name = process.env.MONGODB_DB_NAME) {
    const client = await getMongoClient()

    if (name) return client.db(name)

    // Fallback to default DB from connection string if no explicit DB name is set.
    return client.db()
}

export async function createUserIndexes(db: Db) {
    await db
        .collection('users')
        .createIndex({ accountId: 1 }, { unique: true })
}

export async function createSessionIndexes(db: Db) {
    await db
        .collection('sessions')
        .createIndex({ accountId: 1, startedAt: -1 })
}

'use client'

const KEYS = {
    apiKey: 'gw2_api_key',
    session: 'gw2_session',
} as const

export type StoredSession = {
    startedAt: number
    initialKills: number
    currentKills: number
    maxKills: number
    achievementId: number
}

// --- API Key ---

export function getApiKey(): string | null {
    return localStorage.getItem(KEYS.apiKey)
}

export function setApiKey(key: string): void {
    localStorage.setItem(KEYS.apiKey, key)
}

export function clearApiKey(): void {
    localStorage.removeItem(KEYS.apiKey)
}

// --- Session ---

export function getSession(): StoredSession | null {
    try {
        const raw = localStorage.getItem(KEYS.session)
        if (!raw) return null
        return JSON.parse(raw) as StoredSession
    } catch {
        return null
    }
}

export function saveSession(session: StoredSession): void {
    localStorage.setItem(KEYS.session, JSON.stringify(session))
}

export function clearSession(): void {
    localStorage.removeItem(KEYS.session)
}

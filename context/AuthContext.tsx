'use client'

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { setApiKey as storeApiKey } from '@/lib/local-storage'

type User = {
    accountId: string
    accountName: string
    wvwRank: number
    hasApiKey: boolean
}

type AuthContextValue = {
    user: User | null
    login: (apiKey: string) => Promise<void>
    clearApiKey: () => void
    ready: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [ready, setReady] = useState(false)

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch('/api/user')
            if (!res.ok) {
                setUser(null)
                return
            }
            setUser(await res.json())
        } catch {
            setUser(null)
        }
    }, [])

    // Check auth on mount
    useEffect(() => {
        fetchUser().finally(() => setReady(true))
    }, [fetchUser])

    // Cross-tab sync via localStorage
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'gw2_api_key') {
                fetchUser()
            }
        }

        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [fetchUser])

    const clearApiKey = useCallback(() => {
        setUser((prev) =>
            prev ? { ...prev, hasApiKey: false } : null,
        )
    }, [])

    const login = async (apiKey: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey }),
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message ?? 'Login failed')
        }

        storeApiKey(apiKey)
        setUser({
            accountId: data.accountId,
            accountName: data.accountName,
            wvwRank: data.wvwRank,
            hasApiKey: data.hasApiKey,
        })
    }

    return (
        <AuthContext.Provider value={{ user, login, clearApiKey, ready }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}

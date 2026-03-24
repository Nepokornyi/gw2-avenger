'use client'

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import {
    getApiKey as storedGetApiKey,
    setApiKey as storedSetApiKey,
    clearApiKey,
} from '@/lib/local-storage'

type ApiKeyContextValue = {
    apiKey: string | null
    setApiKey: (key: string | null) => void
    ready: boolean
}

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null)

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
    const [apiKey, setApiKeyState] = useState<string | null>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setApiKeyState(storedGetApiKey())
        setReady(true)
    }, [])

    const setApiKey = (key: string | null) => {
        if (key) {
            storedSetApiKey(key)
        } else {
            clearApiKey()
        }
        setApiKeyState(key)
    }

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey, ready }}>
            {children}
        </ApiKeyContext.Provider>
    )
}

export const useApiKey = () => {
    const ctx = useContext(ApiKeyContext)
    if (!ctx) throw new Error('useApiKey must be used inside ApiKeyProvider')

    return ctx
}

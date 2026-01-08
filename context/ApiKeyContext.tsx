'use client'

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'

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
        const stored = localStorage.getItem('gw2_api_key')
        setApiKeyState(stored)
        setReady(true)
    }, [])

    const setApiKey = (key: string | null) => {
        if (key) {
            localStorage.setItem('gw2_api_key', key)
        } else {
            localStorage.removeItem('gw2_api_key')
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

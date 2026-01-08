'use client'

import { useEffect, useState } from 'react'

export const ApiGateway = () => {
    const [keyInput, setKeyInput] = useState('')
    const [APIKey, setAPIKey] = useState<string | null>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setAPIKey(localStorage.getItem('gw2_api_key'))
        setReady(true)
    }, [])

    useEffect(() => {
        if (!APIKey) return

        const verifyKey = async () => {
            try {
                const res = await fetch('/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey: APIKey }),
                })

                if (!res.ok) throw new Error('Invalid key')

                const data = await res.json()
                console.log('Valid key data: ', data)
            } catch (err) {
                console.error('Request failed', err)
            }
        }

        verifyKey()
    }, [APIKey])

    const handleSave = (key: string) => {
        localStorage.setItem('gw2_api_key', key)
        setAPIKey(key)
    }

    if (!ready) return null

    return (
        <>
            {!APIKey && (
                <div>
                    <div className="flex gap-5">
                        <input
                            className="bg-white text-black border-none"
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            placeholder="xxxxxxxx-xxxx-xxxx"
                            type="text"
                            name="api"
                            id="api"
                        />
                        <button
                            className="border border-white p-1.5"
                            onClick={() => handleSave(keyInput)}
                        >
                            Add Key
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

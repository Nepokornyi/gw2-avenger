'use client'

import { useApiKey } from '@/context/ApiKeyContext'
import { useState } from 'react'

export const ApiGateway = () => {
    const { apiKey, setApiKey, ready } = useApiKey()
    const [keyInput, setKeyInput] = useState('')

    if (!ready || apiKey) return null

    const handleSave = async () => {
        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: keyInput }),
            })

            if (!res.ok) throw new Error('Invalid key')

            setApiKey(keyInput)

            const data = await res.json()
            console.log('Valid key data: ', data)
        } catch (err) {
            console.error('Request failed', err)
        }
    }

    return (
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
                    onClick={handleSave}
                >
                    Add Key
                </button>
            </div>
        </div>
    )
}

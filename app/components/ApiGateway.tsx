'use client'

import { useApiKey } from '@/context/ApiKeyContext'
import { useState } from 'react'

export const ApiGateway = () => {
    const { apiKey, setApiKey, ready } = useApiKey()
    const [keyInput, setKeyInput] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    if (!ready || apiKey) return null

    const handleSave = async () => {
        setError(null)
        setLoading(true)

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: keyInput }),
            })

            if (!res.ok) throw new Error('Invalid key')

            const data = await res.json()

            if (!data.valid) throw new Error('Key not valid')

            setApiKey(keyInput)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="animate-fade-in border border-border bg-bg-surface p-8 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-dim to-transparent" />

            <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-1.5 bg-gold" />
                <h2 className="text-text font-medium tracking-wide uppercase text-sm">
                    Connect Account
                </h2>
            </div>
            <p className="text-text-muted text-sm mb-6 ml-4">
                Enter your GW2 API key with{' '}
                <span className="text-gold-dim">account</span> +{' '}
                <span className="text-gold-dim">progression</span> permissions.
            </p>

            <div className="flex gap-3">
                <input
                    className="flex-1 bg-bg-base border border-border px-4 py-2.5 text-sm text-text font-mono placeholder:text-text-dim focus:outline-none focus:border-gold-dim transition-colors duration-300"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                    type="text"
                    name="api"
                    id="api"
                    disabled={loading}
                />
                <button
                    className="group relative bg-transparent border border-gold-dim text-gold text-sm font-medium tracking-wider uppercase px-6 py-2.5 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold-light hover:shadow-[0_0_15px_var(--gold-glow)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    onClick={handleSave}
                    disabled={loading || !keyInput.trim()}
                >
                    <span className="relative z-10">
                        {loading ? 'Verifying' : 'Connect'}
                    </span>
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
            </div>

            {error && (
                <p className="text-red-light text-sm mt-4 animate-fade-in">
                    {error}
                </p>
            )}
        </div>
    )
}

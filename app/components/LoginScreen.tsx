'use client'

import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'

export const LoginScreen = () => {
    const { login } = useAuth()
    const [keyInput, setKeyInput] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setError(null)
        setLoading(true)

        try {
            await login(keyInput)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && keyInput.trim() && !loading) {
            handleSubmit()
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-lg animate-fade-in">
                {/* Title */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold-dim" />
                        <div className="w-2 h-2 bg-gold rotate-45" />
                        <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold-dim" />
                    </div>
                    <h1 className="text-4xl font-semibold tracking-widest uppercase text-gold mb-3">
                        GW2 Avenger
                    </h1>
                    <p className="text-text-muted text-base tracking-wide">
                        Track your World vs World journey
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="text-sm text-red-light">Player Kill Tracking</div>
                    <div className="text-sm text-green">Objective Captures</div>
                    <div className="text-sm text-blue">Objective Defenses</div>
                    <div className="text-sm text-amber">Supply &amp; Logistics</div>
                </div>

                {/* Login card */}
                <Card className="p-8">
                    <h2 className="text-text font-medium tracking-wide uppercase text-base mb-2">
                        Connect Account
                    </h2>
                    <p className="text-text-muted text-sm mb-6">
                        Enter your GW2 API key to get started.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Input
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                            disabled={loading}
                        />
                        <Button
                            className="w-full text-base px-6 py-3"
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={!keyInput.trim()}
                        >
                            {loading ? 'Connecting' : 'Connect'}
                        </Button>
                    </div>

                    {error && (
                        <p className="text-red-light text-sm mt-4 animate-fade-in">
                            {error}
                        </p>
                    )}

                    {/* Help text */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-text-dim text-sm leading-relaxed">
                            Create an API key at{' '}
                            <a
                                href="https://account.arena.net/applications"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold-dim hover:text-gold transition-colors duration-300 underline underline-offset-2"
                            >
                                account.arena.net
                            </a>
                            {' '}with{' '}
                            <span className="text-text-muted">account</span> and{' '}
                            <span className="text-text-muted">progression</span> permissions enabled.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

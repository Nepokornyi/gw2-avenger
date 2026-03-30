'use client'

import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'

const FEATURES = [
    {
        label: 'Player Kill Tracking',
        color: 'text-red-light',
        dotColor: 'bg-red-light',
    },
    { label: 'Objective Captures', color: 'text-green', dotColor: 'bg-green' },
    { label: 'Objective Defenses', color: 'text-blue', dotColor: 'bg-blue' },
    { label: 'Supply & Logistics', color: 'text-amber', dotColor: 'bg-amber' },
]

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
        <div
            className="min-h-screen flex items-center justify-center px-6"
            style={{
                background:
                    'radial-gradient(ellipse 50% 35% at 50% 25%, rgba(200, 162, 82, 0.05), transparent)',
            }}
        >
            <div className="w-full max-w-lg animate-fade-in relative">
                {/* Title */}
                <div className="text-center mb-12">
                    {/* Ornate diamond emblem */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <div className="absolute w-9 h-9 border border-gold/40 rotate-45" />
                            <div className="absolute w-5 h-5 border border-gold/70 rotate-45" />
                            <div className="absolute w-2 h-2 bg-gold rotate-45" />
                        </div>
                    </div>

                    <h1 className="font-display text-4xl font-semibold tracking-[0.2em] uppercase text-gold mb-4">
                        GW2 Avenger
                    </h1>

                    {/* Ornate divider */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-dim" />
                        <div className="w-1.5 h-1.5 bg-gold-dim rotate-45" />
                        <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-dim" />
                    </div>

                    <p className="text-text-muted text-base tracking-wide">
                        Track your World vs World journey
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-2 gap-3 mb-10">
                    {FEATURES.map((f) => (
                        <div
                            key={f.label}
                            className="flex items-center gap-2.5 px-3 py-2.5 border border-border bg-bg-surface/50"
                        >
                            <div
                                className={`w-1.5 h-1.5 ${f.dotColor} rotate-45 shrink-0`}
                            />
                            <span
                                className={`text-sm ${f.color} tracking-wide leading-loose`}
                            >
                                {f.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Login card */}
                <Card>
                    <h2 className="font-display text-text font-medium tracking-[0.15em] uppercase text-base mb-2">
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
                            </a>{' '}
                            with{' '}
                            <span className="text-text-muted">account</span> and{' '}
                            <span className="text-text-muted">progression</span>{' '}
                            permissions enabled.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

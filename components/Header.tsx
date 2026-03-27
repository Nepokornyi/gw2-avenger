'use client'

import { useAuth } from '@/context/AuthContext'

export const Header = () => {
    const { user } = useAuth()

    return (
        <header className="w-full border-b border-border bg-bg-surface/50 backdrop-blur-sm animate-fade-in-slow">
            <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gold" />
                    <span className="text-gold font-semibold tracking-widest uppercase text-lg">
                        GW2 Avenger
                    </span>
                </div>

                {user && (
                    <div className="flex items-center gap-3 text-base">
                        <span className="text-text-muted">{user.accountName}</span>
                        <span className="text-text-dim">·</span>
                        <span className="text-text-dim">WvW Rank {user.wvwRank.toLocaleString()}</span>
                    </div>
                )}
            </div>
        </header>
    )
}

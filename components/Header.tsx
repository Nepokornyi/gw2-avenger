'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
    { href: '/', label: 'Dashboard' },
    { href: '/history', label: 'History' },
]

export const Header = () => {
    const { user } = useAuth()
    const pathname = usePathname()

    return (
        <header className="w-full border-b border-border bg-bg-surface/50 backdrop-blur-sm animate-fade-in-slow">
            <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-gold" />
                        <span className="text-gold font-semibold tracking-widest uppercase text-lg">
                            GW2 Avenger
                        </span>
                    </div>

                    <nav className="flex gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm uppercase tracking-widest transition-colors duration-300 ${
                                    pathname === link.href
                                        ? 'text-gold'
                                        : 'text-text-muted hover:text-gold'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
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

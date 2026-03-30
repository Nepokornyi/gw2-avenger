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
        <header className="w-full bg-bg-surface/80 backdrop-blur-md animate-fade-in-slow relative">
            <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    {/* Logo with diamond emblem */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-7 h-7">
                            <div className="absolute w-4 h-4 border border-gold rotate-45" />
                            <div className="absolute w-2 h-2 bg-gold rotate-45" />
                        </div>
                        <span className="font-display text-gold font-semibold tracking-[0.2em] uppercase text-lg">
                            GW2 Avenger
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-sm uppercase tracking-[0.15em] transition-colors duration-300 py-1 ${
                                    pathname === link.href
                                        ? 'text-gold'
                                        : 'text-text-muted hover:text-gold-light'
                                }`}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <span className="absolute -bottom-[1px] left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                {user && (
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-text-muted tracking-wide">{user.accountName}</span>
                        <div className="w-1 h-1 bg-gold-dim rotate-45" />
                        <span className="text-text-dim tracking-wide">Rank {user.wvwRank.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {/* Ornate bottom border */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-dim/50 to-transparent" />
        </header>
    )
}

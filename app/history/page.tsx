'use client'

import { useAuth } from '@/context/AuthContext'
import { useSessionHistory } from '@/hooks/useSessionHistory'
import { Header } from '@/components/Header'
import { SectionHeading } from '@/components/SectionHeading'
import { SessionHistoryItem } from '../components/SessionHistoryItem'

export default function HistoryPage() {
    const { user, ready } = useAuth()
    const { sessions, loading } = useSessionHistory()

    if (!ready || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="inline-block w-5 h-5 border-2 border-gold-dim border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!user?.hasApiKey) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-text-muted text-base">Not authenticated</p>
            </div>
        )
    }

    return (
        <div className="font-sans min-h-screen">
            <Header />
            <main className="max-w-6xl mx-auto px-8 py-12">
                <SectionHeading color="text-gold">
                    Session History
                </SectionHeading>

                {sessions.length === 0 ? (
                    <p className="text-text-muted text-base">
                        No sessions recorded yet. Start a tracking session from the dashboard.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {sessions.map((session) => (
                            <SessionHistoryItem
                                key={session._id}
                                session={session}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

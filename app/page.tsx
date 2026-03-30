'use client'

import { Header } from '@/components/Header'
import { LoginScreen } from './components/LoginScreen'
import { Dashboard } from './components/Dashboard'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
    const { user, ready } = useAuth()

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="inline-block w-5 h-5 border-2 border-gold-dim border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!user?.hasApiKey) {
        return <LoginScreen />
    }

    return (
        <div className="font-sans min-h-screen">
            <Header />
            <main className="max-w-6xl mx-auto px-8 py-12">
                <Dashboard />
            </main>
        </div>
    )
}

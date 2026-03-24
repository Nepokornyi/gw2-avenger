'use client'
import { Header } from '@/components/Header'
import { ApiGateway } from './components/ApiGateway'
import { RealmAvengerTracking } from './components/RealmAvengerTracking'
import { ApiKeyProvider } from '@/context/ApiKeyContext'

export default function Home() {
    return (
        <div className="font-sans min-h-screen">
            <ApiKeyProvider>
                <Header />
                <main className="max-w-5xl mx-auto px-8 py-12 flex flex-col gap-6">
                    <ApiGateway />
                    <RealmAvengerTracking />
                </main>
            </ApiKeyProvider>
        </div>
    )
}

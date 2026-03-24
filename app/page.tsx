'use client'
import { Header } from '@/components/Header'
import { ApiGateway } from './components/ApiGateway'
import { RealmAvengerTracking } from './components/RealmAvengerTracking'
import { ApiKeyProvider } from '@/context/ApiKeyContext'

export default function Home() {
    const handleCall = async () => {
        const res = await fetch('/api/db')
        const data = await res.json()
        console.log(data)
    }
    return (
        <div className="font-sans">
            <ApiKeyProvider>
                <Header />
                <main className="flex flex-col gap-10 w-full justify-center items-center">
                    <ApiGateway />
                    <RealmAvengerTracking />
                    <button
                        className="bg-red-400 px-2 py-1 hover:bg-red-600 cursor-pointer"
                        onClick={handleCall}
                    >
                        call db
                    </button>
                </main>
            </ApiKeyProvider>
        </div>
    )
}

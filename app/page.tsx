// import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ApiGateway } from './components/ApiGateway'
import { RealmAvengerTracking } from './components/RealmAvengerTracking'
import { ApiKeyProvider } from '@/context/ApiKeyContext'

export default function Home() {
    return (
        <div className="font-sans">
            <ApiKeyProvider>
                <Header />
                <main className="flex flex-col gap-10 w-full justify-center items-center">
                    <ApiGateway />
                    <RealmAvengerTracking />
                </main>
                {/* <Footer /> */}
            </ApiKeyProvider>
        </div>
    )
}

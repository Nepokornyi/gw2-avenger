// import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ApiGateway } from './components/ApiGateway'
import { AvengerTracking } from './components/AvengerTracking'

export default function Home() {
    return (
        <div className="font-sans">
            <Header />
            <main className="flex flex-col gap-10 w-full justify-center items-center">
                <ApiGateway />
                <AvengerTracking />
            </main>
            {/* <Footer /> */}
        </div>
    )
}

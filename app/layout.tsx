import type { Metadata } from 'next'
import { Niramit } from 'next/font/google'
import './globals.css'

const niramitFont = Niramit({
    variable: '--font-niramit-sans',
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
    title: 'GW2 Avenger tracker',
    description: 'Web app to track your wvw activity',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${niramitFont.variable} antialiased`}>
                {children}
            </body>
        </html>
    )
}

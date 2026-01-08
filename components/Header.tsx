import React from 'react'

export const Header = () => {
    return (
        <header className="w-full flex justify-end px-10 py-5">
            <nav className="flex gap-5">
                <div className="cursor-pointer hover:underline">API keys</div>
                <div className="cursor-pointer hover:underline">Login</div>
            </nav>
        </header>
    )
}

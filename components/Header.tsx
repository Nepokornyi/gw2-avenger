export const Header = () => {
    return (
        <header className="w-full border-b border-border bg-bg-surface/50 backdrop-blur-sm animate-fade-in-slow">
            <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-gold" />
                    <span className="text-gold font-semibold tracking-widest uppercase text-sm">
                        GW2 Avenger
                    </span>
                </div>
                <nav className="flex gap-8 text-xs uppercase tracking-widest">
                    <div className="text-text-muted cursor-pointer hover:text-gold transition-colors duration-300 relative group">
                        Dashboard
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                    </div>
                    <div className="text-text-muted cursor-pointer hover:text-gold transition-colors duration-300 relative group">
                        Settings
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                    </div>
                </nav>
            </div>
        </header>
    )
}

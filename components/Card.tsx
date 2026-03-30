import { type ReactNode } from 'react'

type Props = {
    children: ReactNode
    accentColor?: string
    className?: string
}

export const Card = ({
    children,
    accentColor = 'via-gold-dim',
    className = '',
}: Props) => {
    return (
        <div
            className={`relative border border-border bg-bg-surface overflow-hidden animate-fade-in card-shadow ${className}`}
        >
            {/* Top accent gradient line */}
            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${accentColor} to-transparent`} />

            {/* Corner ornaments */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold-dim/30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold-dim/30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold-dim/30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold-dim/30" />

            <div className="p-6">
                {children}
            </div>
        </div>
    )
}

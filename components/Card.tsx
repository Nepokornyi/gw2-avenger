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
        <div className={`border border-border bg-bg-surface relative overflow-hidden animate-fade-in ${className}`}>
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent ${accentColor} to-transparent`} />
            <div className="p-6">
                {children}
            </div>
        </div>
    )
}

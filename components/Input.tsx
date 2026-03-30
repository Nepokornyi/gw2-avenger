import { type InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

export const Input = ({ className = '', ...props }: Props) => {
    return (
        <input
            className={`w-full bg-bg-base border border-border px-4 py-3 text-base text-text font-mono placeholder:text-text-dim focus:outline-none focus:border-gold-dim focus:shadow-[0_0_12px_var(--gold-glow)] transition-all duration-300 ${className}`}
            {...props}
        />
    )
}

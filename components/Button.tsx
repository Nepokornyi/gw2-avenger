import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    loading?: boolean
}

const variantStyles: Record<Variant, { base: string; hover: string; glow: string }> = {
    primary: {
        base: 'border-gold-dim text-gold',
        hover: 'hover:border-gold hover:text-gold-light hover:shadow-[0_0_15px_var(--gold-glow)]',
        glow: 'bg-gold/5',
    },
    danger: {
        base: 'border-red/40 text-red-light',
        hover: 'hover:border-red hover:text-text hover:shadow-[0_0_20px_rgba(170,32,32,0.15)]',
        glow: 'bg-red/5',
    },
}

export const Button = ({
    variant = 'primary',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}: Props) => {
    const styles = variantStyles[variant]

    return (
        <button
            className={`group relative bg-transparent border font-medium tracking-wider uppercase cursor-pointer transition-all duration-300 ${styles.base} ${styles.hover} disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                    <span className="inline-block w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                )}
                {children}
            </span>
            <div className={`absolute inset-0 ${styles.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </button>
    )
}

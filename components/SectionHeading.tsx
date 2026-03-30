type Props = {
    children: string
    color?: string
}

export const SectionHeading = ({
    children,
    color = 'text-text',
}: Props) => {
    return (
        <div className="flex items-center gap-4 mb-6">
            <h2 className={`${color} font-display font-medium tracking-[0.15em] uppercase text-base shrink-0`}>
                {children}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        </div>
    )
}

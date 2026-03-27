type Props = {
    children: string
    color?: string
}

export const SectionHeading = ({
    children,
    color = 'text-text',
}: Props) => {
    return (
        <h2 className={`${color} font-medium tracking-wide uppercase text-base mb-5`}>
            {children}
        </h2>
    )
}

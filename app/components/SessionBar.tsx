'use client'

import { Card } from '@/components/Card'
import { Button } from '@/components/Button'

type Props = {
    isActive: boolean
    elapsedTime: number
    pending: boolean
    onStart: () => void
    onStop: () => void
}

function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
}

export const SessionBar = ({
    isActive,
    elapsedTime,
    pending,
    onStart,
    onStop,
}: Props) => {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <h2 className="text-text font-medium tracking-wide uppercase text-base">
                        {isActive ? 'Session Active' : 'Session'}
                    </h2>

                    {isActive && (
                        <div className="text-text font-mono text-2xl tracking-wider animate-fade-in">
                            {formatTime(elapsedTime)}
                        </div>
                    )}
                </div>

                {!isActive ? (
                    <Button
                        className="text-sm px-6 py-2.5"
                        onClick={onStart}
                        loading={pending}
                    >
                        {pending ? 'Starting' : 'Start Session'}
                    </Button>
                ) : (
                    <Button
                        variant="danger"
                        className="text-sm px-5 py-2"
                        onClick={onStop}
                    >
                        Stop
                    </Button>
                )}
            </div>
        </Card>
    )
}

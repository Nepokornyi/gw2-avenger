'use client'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { KillerResponseSchema } from '../api/killer/schema'

type AvengerStats = z.infer<typeof KillerResponseSchema>

export const AvengerTracking = () => {
    const [ready, setReady] = useState(false)
    const [APIKey, setAPIKey] = useState<string | null>(null)
    const [avengerStats, setAvengerStats] = useState<AvengerStats | null>(null)

    const [sessionStart, setSessionStart] = useState<number | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)

    const [initialKills, setInitialKills] = useState<number | null>(null)
    const [pollingActive, setPollingActive] = useState(false)

    useEffect(() => {
        setAPIKey(localStorage.getItem('gw2_api_key'))
        setReady(true)
    }, [])

    useEffect(() => {
        if (!sessionStart) return

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - sessionStart) / 1000))
        }, 1000)

        return () => clearInterval(interval)
    }, [sessionStart])

    useEffect(() => {
        if (!pollingActive && !APIKey) return

        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/killer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apiKey: APIKey }),
                })

                if (!res.ok) throw new Error('Polling failed')

                const { avenger } = await res.json()
                setAvengerStats(avenger)
            } catch (err) {
                console.error('Polling error:', err)
            }
        }, 180000)

        return () => clearInterval(interval)
    }, [pollingActive, APIKey])

    const handleStartKilling = async () => {
        try {
            const res = await fetch('/api/killer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: APIKey }),
            })

            if (!res.ok) throw new Error('Invalid key')

            const { avenger } = await res.json()
            setAvengerStats(avenger)

            setSessionStart(Date.now())
            setInitialKills(avenger.current)
            setPollingActive(true)
        } catch (err) {
            console.error('Request failed', err)
        }
    }

    if (!ready) return null

    return (
        <div className="flex flex-col items-center gap-2.5">
            {!sessionStart && (
                <button
                    className="p-2 text-black bg-white cursor-pointer"
                    onClick={handleStartKilling}
                >
                    Start Killing
                </button>
            )}

            {avengerStats && (
                <div className="flex gap-5">
                    <span>Achievement id: {avengerStats.id}</span>
                    <span>Max kills: {avengerStats.max}</span>
                    <span className="font-bold">
                        Current kills: {avengerStats.current}
                    </span>
                </div>
            )}

            {initialKills !== null && avengerStats && (
                <div>
                    Kills this session: {avengerStats.current - initialKills}
                </div>
            )}

            {sessionStart && <div>Session time: {elapsedTime}s</div>}
        </div>
    )
}

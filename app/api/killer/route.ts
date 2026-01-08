import { KillerRequestSchema, KillerResponseSchema } from './schema'

export async function POST(req: Request) {
    try {
        const body = KillerRequestSchema.parse(await req.json())

        const res = await fetch(
            'https://api.guildwars2.com/v2/account/achievements?id=283',
            {
                headers: {
                    Authorization: `Bearer ${body.apiKey}`,
                },
            }
        )

        if (!res.ok)
            Response.json({
                status: 401,
                message: 'Unauthorized. Invalid API Key.',
            })

        const data = await res.json()
        const avenger = KillerResponseSchema.parse(data)

        return Response.json({ avenger })
    } catch (err) {
        console.error('GW2 Verification failed: ', err)

        return Response.json({ status: 400 })
    }
}

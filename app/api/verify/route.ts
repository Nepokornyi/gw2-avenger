import { Gw2AccountSchema, VerifyKeyRequestSchema } from './schema'

export async function POST(req: Request) {
    try {
        const body = VerifyKeyRequestSchema.parse(await req.json())

        const res = await fetch('https://api.guildwars2.com/v2/account', {
            headers: {
                Authorization: `Bearer ${body.apiKey}`,
            },
        })

        if (!res.ok)
            Response.json(
                { valid: false, message: 'Unauthorized. Invalid API Key.' },
                { status: 401 }
            )

        const data = await res.json()
        const account = Gw2AccountSchema.parse(data)

        return Response.json({ valid: true, account })
    } catch (err) {
        console.error('GW2 Verification failed: ', err)

        return Response.json({ valid: false }, { status: 400 })
    }
}

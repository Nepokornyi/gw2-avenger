import { z } from 'zod'
import { Gw2AccountSchema } from './schema'

export type Gw2Account = z.infer<typeof Gw2AccountSchema>

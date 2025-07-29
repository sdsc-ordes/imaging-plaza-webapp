import {z} from 'zod'

export const GimiePayload = z.object({repository: z.string().url()})
export type GimiePayload = z.infer<typeof GimiePayload>

import {z} from 'zod'

export const FairLevelPayload = z.object({fairLevel: z.number()})
export type FairLevelPayload = z.infer<typeof FairLevelPayload>

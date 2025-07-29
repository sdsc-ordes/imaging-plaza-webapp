import {z} from 'zod'

export const SupportMessageZod = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
})

export type SupportMessage = z.infer<typeof SupportMessageZod>

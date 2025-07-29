import {z} from 'zod'

export const FAQZod = z.object({
  id: z.string(),
  questionEn: z.string(),
  answerEn: z.string(),
  categoryEn: z.string(),
  categoryOrder: z.number(),
  questionOrder: z.number(),
})

export type Faq = z.infer<typeof FAQZod>

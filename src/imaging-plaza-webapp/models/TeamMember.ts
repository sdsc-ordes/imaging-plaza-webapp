import {z} from 'zod'

export const TeamMemberZod = z.object({
  id: z.string(),
  descEn: z.string(),
  name: z.string(),
  group: z.string(),
  picture: z.string(),
  titleEn: z.string(),
  order: z.number(),
})
export type TeamMember = z.infer<typeof TeamMemberZod>

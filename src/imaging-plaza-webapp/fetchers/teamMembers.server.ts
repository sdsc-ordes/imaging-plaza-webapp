import {TeamMemberZod} from '../models/TeamMember'
import {getSupabaseAdmin} from '../utils/supabase/admin'

interface TeamMemberRow {
  id: string
  name: string
  title_en: string
  desc_en: string
  group_name: string
  picture: string
  order_index: number
}

export const getTeamMembers = async () => {
  try {
    const {data, error} = await getSupabaseAdmin()
      .from('team_members')
      .select('*')
      .order('order_index', {ascending: true})
    if (error) throw error
    return (data as TeamMemberRow[]).map(row =>
      TeamMemberZod.parse({
        id: row.id,
        name: row.name,
        titleEn: row.title_en,
        descEn: row.desc_en,
        group: row.group_name,
        picture: row.picture,
        order: row.order_index,
      })
    )
  } catch (e) {
    console.error(e)
    return []
  }
}

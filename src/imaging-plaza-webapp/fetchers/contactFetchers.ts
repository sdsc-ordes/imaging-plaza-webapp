import {SupportMessage} from '../models/SupportMessage'
import {getSupabaseClient} from '../utils/supabase/client'

// contact_submissions has an `insert: true` RLS policy so anonymous
// visitors can submit. Admin reads are limited to is_admin().
export const writeSupportMessage = async (message: SupportMessage) => {
  const {error} = await getSupabaseClient()
    .from('contact_submissions')
    .insert(message)
  if (error) throw error
}

import DOMPurify from 'isomorphic-dompurify'
import {FAQZod} from '../models/Faq'
import {getSupabaseAdmin} from '../utils/supabase/admin'

interface FaqRow {
  id: string
  question_en: string
  answer_en: string
  category_en: string
  category_order: number
  question_order: number
}

export const getFaq = async () => {
  try {
    const {data, error} = await getSupabaseAdmin()
      .from('faqs')
      .select('*')
      .order('category_order', {ascending: true})
      .order('question_order', {ascending: true})
    if (error) throw error
    return (data as FaqRow[]).map(row =>
      FAQZod.parse({
        id: row.id,
        questionEn: row.question_en,
        answerEn: DOMPurify.sanitize(row.answer_en),
        categoryEn: row.category_en,
        categoryOrder: row.category_order,
        questionOrder: row.question_order,
      })
    )
  } catch (e) {
    console.error(e)
    return []
  }
}

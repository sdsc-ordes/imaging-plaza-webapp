import { searchSoftwares } from './sparqlFetchers.server'
import { FAIR_LEVEL_ORDER } from '../components/Form/schema-consts'

export const getPopularSoftware = async () => {
  try {
    const searched = await searchSoftwares('')

    searched.sort((a, b) => {
      const aLevel = a['imag:fairLevel'] ? FAIR_LEVEL_ORDER[a['imag:fairLevel']] : 0 // default to 0 if not found
      const bLevel = b['imag:fairLevel'] ? FAIR_LEVEL_ORDER[b['imag:fairLevel']] : 0 // default to 0 if not found
      return bLevel - aLevel // descending order
    })

    return searched.slice(0, 6)
  } catch (e) {
    console.error(e)
    return []
  }
}

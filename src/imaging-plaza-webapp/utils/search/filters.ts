import {ALL_FILTERS_GROUPS} from '../../constants/softwareProperties'

export const getFilterByNameKey = (nameKey: string) => {
  return ALL_FILTERS_GROUPS.flatMap(x => x.filters).find(x => nameKey == x.nameKey)
}

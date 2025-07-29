import {SoftwarePropertiesGroup} from '../../models/SoftwareProperties'
import SearchBar from '../Common/SearchBar/SearchBar'

type Props = {
  suggestedCategories?: SoftwarePropertiesGroup[]
  startQuery?: string
  isHome?: boolean
  onQuery: (q: string) => void
}

//Search bar
const PageSearchBar = ({suggestedCategories, startQuery, onQuery}: Props) => {
  return <SearchBar startQuery={startQuery} isHome={false} onQuery={onQuery} />
}

// noinspection JSUnusedGlobalSymbols
export default PageSearchBar

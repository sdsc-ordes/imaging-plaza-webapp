import {VStack, Wrap} from '@chakra-ui/react'
import {SoftwarePropertiesGroup, SoftwareProperty} from '../../../../models/SoftwareProperties'
import SoftwareCategoriesComponent from '../../Categories/SoftwareCategoriesComponent'
import SearchDivider from './SearchDivider'
import {ROUTES_SEARCH} from '../../../../constants/routes'
import {Translate} from 'next-translate'

interface Props {
  suggestedFilters: SoftwarePropertiesGroup[]
  t: Translate
}

const SoftwareCategorySuggestions = ({suggestedFilters, t}: Props) => {
  return (
    <VStack w='100%'>
      <SearchDivider text='Or select a category' />
      {suggestedFilters.map((filterGroup, key) => (
        <VStack w='100%' key={key} align='start'>
          <Wrap py={3} px='4px'>
            <SoftwareCategoriesComponent
              properties={filterGroup.filters}
              push={(filter: SoftwareProperty) => {
                return ROUTES_SEARCH([{name: filterGroup.nameKey, value: filter.nameKey}])
              }}
              t={t}
            />
          </Wrap>
        </VStack>
      ))}
    </VStack>
  )
}

// noinspection JSUnusedGlobalSymbols
export default SoftwareCategorySuggestions

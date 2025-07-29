import {Text, VStack, useBreakpoint} from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import Placeholder from '../Common/Placeholder'
import HSoftwareCard from '../Common/SoftwareCard/HSoftwareCard'
import VSoftwareCard from '../Common/SoftwareCard/VSoftwareCard'
import {SchemaSoftwareSourceCode} from '../Form/schema'

type SearchHitsProps = {
  softwares: SchemaSoftwareSourceCode[]
}

/**
 * How to display search result
 */
const Hit = ({hit}: {hit: SchemaSoftwareSourceCode}) => {
  const isDesktop = useBreakpoint('md')

  return isDesktop ? <HSoftwareCard software={hit} /> : <VSoftwareCard software={hit} />
}

export const SearchHits = ({softwares}: SearchHitsProps) => {
  const {t} = useTranslation()

  return (
    <VStack h='full' w='full' spacing={{base: 8, md: 6}}>
      {isEmpty(softwares) ? (
        <Placeholder placeholder='/placeholders/search.svg' text={t('search:empty_results')} />
      ) : (
        <>
          <VStack align='stretch' justify='start' w='full' spacing={{base: 8, md: 6}}>
            <Text color='brand.grey'>
              {softwares.length} {t('common:results')}
            </Text>
            {softwares.map(item => (
              <Hit hit={item} key={item['schema:identifier']} />
            ))}
          </VStack>
        </>
      )}
    </VStack>
  )
}

export default SearchHits

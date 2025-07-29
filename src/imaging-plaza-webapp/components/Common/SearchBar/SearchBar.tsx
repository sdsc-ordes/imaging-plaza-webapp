import {Box, Button, Flex, HStack, Input, Text, useTheme, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useEffect, useState} from 'react'
import MagnifyingGlass from '../../Icons/solid/MagnifyingGlass.svg'
import searchBar from './searchBar.module.scss'

type Props = {
  startQuery?: string
  placeholder?: string
  isHome?: boolean
  onQuery: (newQuery: string) => void
}

/**
 * Display the searchbar
 * Sorry there is a bit of a mess with the scss, but it would take too much time to be certain it's useless
 */
const SearchBar = ({startQuery = '', isHome = false, onQuery}: Props) => {
  const {t} = useTranslation()
  const theme = useTheme()
  const [query, setQuery] = useState(startQuery)

  //Search for start query
  useEffect(() => {
    if (!isHome) {
      onQuery(startQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startQuery])

  return (
    <Box h={{base: 48}} w={{base: '90%', md: '700px', lg: '947px'}} zIndex={100}>
      <Box
        w='full'
        my={isHome ? -20 : 8}
        bgColor={theme.colors.brand.white}
        borderRadius='big'
        shadow='normal'
        px={{base: 6, md: 7}}
        py={7}>
        <VStack w='full'>
          <HStack justify='space-between' w='full' px={{base: 0, md: 5}} py={1}>
            <form
              style={{width: '100%'}}
              onSubmit={e => {
                e.preventDefault()
                onQuery(query)
              }}>
              <VStack align='start' w='full'>
                <Text variant='searchTitle'>{t('search:bar_search')}</Text>
                <Flex
                  gap={9}
                  flexDirection={{base: 'column', md: 'row'}}
                  w='full'
                  placeItems='center'
                  justifyContent='center'>
                  <Box
                    flexGrow={1}
                    w='full'
                    fontFamily='heading'
                    //Customize the renderer
                    className={searchBar.searchBar}>
                    <Input
                      placeholder={t('search:bar_placeholder_home')}
                      variant='unstyled'
                      w='full'
                      fontSize='lg'
                      fontWeight='bold'
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                    />
                  </Box>
                  <Button
                    w={{base: 'full', md: 'auto'}}
                    variant='searchBig'
                    type='submit'
                    gridGap={1}
                    leftIcon={<MagnifyingGlass height={16} width={16} />}>
                    {t('search:bar_search')}
                  </Button>
                </Flex>
              </VStack>
            </form>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}

export default SearchBar

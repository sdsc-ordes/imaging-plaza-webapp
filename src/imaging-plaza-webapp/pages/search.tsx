import { Center, HStack, Spinner, Stack, useBoolean, useTheme, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import MainLayout from '../components/layouts/Mainlayout'
import HeadModule from '../components/Modules/HeaderModules'
import PageSearchBar from '../components/Search/PageSearchBar'
import SearchHits from '../components/Search/SearchHits'
import SearchFilters from '../components/Search/SearchFilters'
import { useIsDesktop } from '../hooks/useIsDesktop'
import { Filter, defaultFilters } from '@/models/Filter'
import { useRouter } from 'next/router'
import { SchemaSoftwareSourceCode } from '../components/Form/schema'
import { searchSoftwareInGraph } from '../fetchers/softwareFetchers'

const Search = () => {
  const [isHydrated, setHydrated] = useBoolean()
  const router = useRouter()
  const theme = useTheme()
  const isDesktop = useIsDesktop()

  const [softwares, setSoftwares] = useState<SchemaSoftwareSourceCode[]>([])
  const [isLoading, setLoading] = useBoolean(router.query.query !== '')
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);

  const handleFilterChange = (updatedFilters: Filter[]) => {
    setFilters(updatedFilters);
  };

  useEffect(() => {
    const call = async () => {
      setLoading.on()
      const cleanedFilters = filters.filter(filter => filter.selected.length > 0);

      const hits = await searchSoftwareInGraph((router.query.query as string) ?? '', cleanedFilters)
      // const hits = await searchSoftwareInGraph((router.query.query as string) || '""');
      setSoftwares(hits)
      setLoading.off()
    }
    if (isHydrated) {
      call()
    }
  }, [router.query, isHydrated, filters, setHydrated, setLoading])

  useEffect(() => {
    setTimeout(() => setHydrated.on(), 100)
  }, [setHydrated])

  return (
    isHydrated && (
      <MainLayout>
        <HeadModule title='search:meta_title' description='search:meta_description' />
        <VStack spacing={20} bg={theme.colors.brand.white} pb={isDesktop ? 20 : 0}>
          <PageSearchBar
            onQuery={q => {
              router.replace({ query: { query: q } }, undefined, { shallow: true })
            }}
            startQuery={(router.query.query as string) ?? ''}
          />
          <HStack spacing={0} bg={theme.colors.brand.white} pb={isDesktop ? 20 : 0}
            w={{ base: '100%', lg: '1200px' }} align="start" flexDirection={{ base: 'column', md: 'row' }}>
            <Stack
              w={{ base: '100%', md: '20%' }}
              paddingRight={{base:0, md: 8}}
              paddingLeft={{base:5, md:0}}
              paddingBottom={8}
              spacing={{ base: 5, md: 8 }} 
              borderRadius="big"
              bg={theme.colors.brand.white}
              alignItems="start"
              h="full"
            >
              <SearchFilters onFilterChange={handleFilterChange} />
            </Stack>
            <Stack
              w={{ base: '100%', md: '80%' }}
              direction={{ base: 'column', md: 'row' }}
              h='full'
              borderRadius='2xl'
              bg='brand.superLightGreen'
              alignItems={{ base: 'center', md: 'start' }}
              p={{ base: 5, md: 10 }}
              spacing={{ base: 0, md: 8 }}>
              {isLoading ? (
                <Center w='full'>
                  <Spinner size='lg' />
                </Center>
              ) : (
                <SearchHits softwares={softwares} />
              )}
            </Stack>

          </HStack>
        </VStack>
      </MainLayout>
    )
  )
}

export default Search

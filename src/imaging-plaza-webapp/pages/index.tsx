import { Center, VStack} from '@chakra-ui/react'

import {GetStaticProps} from 'next'
import useTranslation from 'next-translate/useTranslation'
import {useRouter} from 'next/router'
import {useMemo} from 'react'
import SearchBar from '../components/Common/SearchBar/SearchBar'
import SoftwareSection from '../components/Common/SoftwareSection/SoftwareSection'
import {SchemaSoftwareSourceCode} from '../components/Form/schema'
import Attribution from '../components/Home/Attribution'
import FairLevelHome from '../components/Home/FairLevelHome'
import Hero from '../components/Home/Hero'
import HeadModule from '../components/Modules/HeaderModules'
import MainLayout from '../components/layouts/Mainlayout'
import {ROUTES_SEARCH} from '../constants/routes'
import {getPopularSoftware} from '../fetchers/software.server'

interface Props {
  popularSoftwaresData: string
}

const Home = ({popularSoftwaresData}: Props) => {
  const popularSoftwares = useMemo(
    () => JSON.parse(popularSoftwaresData) as SchemaSoftwareSourceCode[],
    [popularSoftwaresData]
  )
  const router = useRouter()
  const {t} = useTranslation()

  return (
    <MainLayout>
      <HeadModule title='meta_title' description='meta_description' />
      <VStack w='full' spacing={0}>
        <Hero />
        <Center mt='+5%' w='full'>
          <SearchBar
            placeholder={t('search:bar_placeholder_home')}
            isHome
            onQuery={item => router.push(ROUTES_SEARCH([{name: 'query', value: item}]))}
          />
        </Center>
        <Attribution />
        <FairLevelHome />
        {popularSoftwares && (
          <SoftwareSection
            softwareList={popularSoftwares}
            title={t('common:home_title_software')}
          />
        )}
      </VStack>
    </MainLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps: GetStaticProps = async () => {
  //TODO this does not fetch popular software but just 6 software at random
  const popularSoftwaresData = JSON.stringify(await getPopularSoftware())

  return {
    props: {
      popularSoftwaresData,
    },
    //Remake page on fetch every 15 minutes
    revalidate: 900,
  }
}

// noinspection JSUnusedGlobalSymbols
export default Home

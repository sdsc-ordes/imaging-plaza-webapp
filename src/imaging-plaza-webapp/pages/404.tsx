import {Button, Flex, Heading, Text} from '@chakra-ui/react'
import {type NextPage} from 'next'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import MainLayout from '../components/layouts/Mainlayout'
import {ROUTES_HOME} from '../constants/routes'

const Page404: NextPage = () => {
  const {t} = useTranslation('common')

  return (
    <MainLayout>
      <Flex placeItems='center' direction='column' gap={10} py={20}>
        <Flex gap={20} placeItems='center'>
          <Text fontSize={200} color='brand.red' fontWeight='bold'>
            404
          </Text>
        </Flex>
        <Heading>{t('error_404_message')}</Heading>
        <Link href={ROUTES_HOME} passHref>
          <Button variant='primary'>{t('error_page_button')}</Button>
        </Link>
      </Flex>
    </MainLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Page404

import {Button, Center, Heading, Stack, useTheme, VStack} from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import {ROUTES_SEARCH} from '../../constants/routes'
import {useIsDesktop} from '../../hooks/useIsDesktop'
import {useUserStore} from '../../stores/userStore'
import Placeholder from '../Common/Placeholder'
import HSoftwareCard from '../Common/SoftwareCard/HSoftwareCard'
import VSoftwareCard from '../Common/SoftwareCard/VSoftwareCard'
import MagnifyingGlass from '../Icons/solid/MagnifyingGlass.svg'

const ActionButton = () => {
  const {t} = useTranslation('account')
  const theme = useTheme()

  return (
    <Link href={ROUTES_SEARCH()} passHref>
      <Button
        variant='outlined'
        bg={theme.colors.brand.white}
        leftIcon={<MagnifyingGlass height={16} width={16} />}>
        {t('account:bookmarks_search_button')}
      </Button>
    </Link>
  )
}

const Bookmarks = () => {
  const {t} = useTranslation()

  const isDesktop = useIsDesktop()

  const softwares = useUserStore(s => s.bookmarks)

  return (
    <>
      <Stack
        w='full'
        direction={{base: 'column', md: 'row'}}
        alignItems={{base: 'start', md: 'center'}}
        justifyContent={{base: 'start', md: 'space-between'}}
        spacing={2.5}>
        <Heading variant='h6'>{t('account:bookmarks_label')}</Heading>
        {isDesktop && <ActionButton />}
      </Stack>
      <Center w='full' h='full'>
        {isEmpty(softwares) ? (
          <Placeholder
            placeholder='/placeholders/bookmarks.svg'
            text={t('account:bookmarks_placeholder')}
          />
        ) : (
          <VStack w='full' spacing={7}>
            {softwares.map(software => {
              if (isDesktop) {
                return <HSoftwareCard key={software['schema:identifier']} software={software} />
              }
              return <VSoftwareCard key={software['schema:identifier']} software={software} />
            })}
          </VStack>
        )}
      </Center>
      {!isDesktop && (
        <Center w='full' h='full'>
          <ActionButton />
        </Center>
      )}
    </>
  )
}

export default Bookmarks

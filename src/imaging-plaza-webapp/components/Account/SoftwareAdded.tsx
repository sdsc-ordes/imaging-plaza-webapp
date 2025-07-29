import {Button, Center, Heading, Stack, useTheme, VStack} from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {ROUTES_ADD_SOFTWARE_START} from '../../constants/routes'
import {useIsDesktop} from '../../hooks/useIsDesktop'
import {useUserStore} from '../../stores/userStore'
import Placeholder from '../Common/Placeholder'
import Plus from '../Icons/solid/Plus.svg'

const HSoftwareCard = dynamic(() => import('../Common/SoftwareCard/HSoftwareCard'))
const VSoftwareCard = dynamic(() => import('../Common/SoftwareCard/VSoftwareCard'))

const ActionButton = () => {
  const {t} = useTranslation('account')
  const theme = useTheme()

  return (
    <Link href={ROUTES_ADD_SOFTWARE_START} passHref>
      <Button
        variant='outlined'
        bg={theme.colors.brand.white}
        leftIcon={<Plus height={16} width={16} />}>
        {t('account:software_added_button')}
      </Button>
    </Link>
  )
}

const SoftwareAdded = () => {
  const softwares = useUserStore(s => s.ownSoftwares)

  const isDesktop = useIsDesktop()

  const {t} = useTranslation('account')

  return (
    <>
      <Stack
        w='full'
        direction={{base: 'column', md: 'row'}}
        alignItems={{base: 'start', md: 'center'}}
        justifyContent={{base: 'start', md: 'space-between'}}
        spacing={2.5}>
        <Heading variant='h6'>{t('account:software_added_label')}</Heading>
        {isDesktop && <ActionButton />}
      </Stack>
      <Center w='full' h='full'>
        {isEmpty(softwares) ? (
          <Placeholder
            placeholder='/placeholders/software-added.svg'
            text={t('account:software_added_placeholder')}
          />
        ) : (
          <VStack w='full' spacing={7}>
            {softwares?.map(software => {
              if (isDesktop) {
                return (
                  <HSoftwareCard
                    key={software['schema:codeRepository'][0]}
                    software={software}
                    editable
                    showTag
                  />
                )
              }
              return (
                <VSoftwareCard
                  key={software['schema:codeRepository'][0]}
                  software={software}
                  editable
                  showTag
                />
              )
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

export default SoftwareAdded

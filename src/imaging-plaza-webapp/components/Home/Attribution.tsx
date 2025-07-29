import {Stack, Text, useTheme, VStack, Link} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import {
  EXTERNAL_ROUTE_EPFL,
  EXTERNAL_ROUTE_IMAGING,
  EXTERNAL_ROUTE_SDSC,
} from '../../constants/routes'

const Attribution = () => {
  const theme = useTheme()

  const {t} = useTranslation()
  return (
    <VStack alignItems={{base: 'center', md: 'center'}} spacing={5} w='full' pb={20}>
      <Text color={theme.colors.brand.textColor} variant='large'>
        {t('common:a_project_by')}
      </Text>
      <Stack direction={{base: 'column', md: 'row'}} spacing={5}>
        <Link isExternal href={EXTERNAL_ROUTE_EPFL}>
          <Image src='/logos/epfl.svg' width={152} height={70} alt='logo-footer' />
        </Link>
        <Link isExternal href={EXTERNAL_ROUTE_IMAGING}>
          <Image src='/logos/center_for_imaging.svg' width={152} height={70} alt='logo-footer' />
        </Link>
        <Link isExternal href={EXTERNAL_ROUTE_SDSC}>
          <Image src='/logos/sdsc.svg' width={152} height={70} alt='logo-footer' />
        </Link>
      </Stack>
    </VStack>
  )
}
export default Attribution

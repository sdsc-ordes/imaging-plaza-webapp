import {Stack, Text, useTheme, Link as ChakraLink, Flex} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import Link from 'next/link'
import {
  EXTERNAL_ROUTE_EPFL,
  EXTERNAL_ROUTE_IMAGING,
  EXTERNAL_ROUTE_SDSC,
  ROUTES_ABOUT,
  ROUTES_CONTACT,
  ROUTES_FAQ,
  ROUTES_HOME,
  ROUTES_PRIVACY,
  ROUTES_TERMS,
} from '../../constants/routes'

interface Props {
  link: string
  name: string
}
const RenderItem = ({link, name}: Props) => {
  const theme = useTheme()

  return (
    <Link href={link} passHref>
      <Text as='button' color={theme.colors.brand.lightGrey} variant='footerLink'>
        {name}
      </Text>
    </Link>
  )
}

const menuEntries = [
  {link: ROUTES_ABOUT, name: 'common:about'},
  {link: ROUTES_FAQ, name: 'common:faq'},
  {link: ROUTES_CONTACT, name: 'common:contact'},
  {link: ROUTES_TERMS, name: 'common:terms_of_services'},
  {link: ROUTES_PRIVACY, name: 'common:privacy_policy'},
]

const Footer = () => {
  const {t} = useTranslation()
  const theme = useTheme()

  return (
    <Stack
      w='full'
      direction={['column', null, 'row']}
      bgColor={theme.colors.brand.black}
      p={[8, null, 16]}
      gap={10}>
      <Flex textAlign='start' justifyContent='start' placeItems='center' grow={1}>
        <Link href={ROUTES_HOME} passHref>
          <Image src='/logos/imaging_plaza_white.svg' width={206} height={33} alt='logo-footer' />
        </Link>
      </Flex>

      <Flex
        direction={['column', null, 'row-reverse']}
        gap={10}
        w='full'
        placeItems={['start', null, 'center']}>
        <Stack>
          <Text color={theme.colors.brand.lightGrey} variant='small'>
            {t('common:a_project_by')}
          </Text>
          <Stack direction='row'>
            <ChakraLink isExternal href={EXTERNAL_ROUTE_EPFL}>
              <Image src='/logos/epfl_white.svg' width={83} height={40} alt='logo-footer' />
            </ChakraLink>
            <ChakraLink isExternal href={EXTERNAL_ROUTE_IMAGING}>
              <Image
                src='/logos/center_for_imaging_white.svg'
                width={83}
                height={40}
                alt='logo-footer'
              />
            </ChakraLink>
            <ChakraLink isExternal href={EXTERNAL_ROUTE_SDSC}>
              <Image src='/logos/sdsc_white.svg' width={83} height={40} alt='logo-footer' />
            </ChakraLink>
          </Stack>
        </Stack>

        <Flex direction='column' gap={5} flexGrow={1} pl={[0, null, 20]} placeItems='start'>
          {menuEntries.map(entry => (
            <RenderItem link={entry.link} name={t(entry.name)} key={entry.link} />
          ))}
        </Flex>
      </Flex>
    </Stack>
  )
}

export default Footer

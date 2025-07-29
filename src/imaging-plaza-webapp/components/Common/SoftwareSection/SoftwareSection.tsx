import {Box, Button, Center, Container, Heading, useTheme, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import {ROUTES_SEARCH} from '../../../constants/routes'
import {SchemaSoftwareSourceCode} from '../../Form/schema'
import Eye from '../../Icons/solid/Eye.svg'
import SoftwareList from './components/SoftwareList'

interface Props {
  softwareList: SchemaSoftwareSourceCode[] | null
  title: string
}

const SoftwareSection = ({softwareList, title}: Props) => {
  const {t} = useTranslation()

  const theme = useTheme()

  return (
    <Box
      w='100vw'
      bgColor={theme.colors.brand.background}
      px={{base: 4, md: 14}}
      pt={{base: 12, md: 16}}
      pb={20}>
      <Container maxW='container.xl'>
        <VStack spacing={10} align='stretch'>
          <Heading variant='h2'>{title}</Heading>
          <SoftwareList software={softwareList} />
          {(softwareList?.length ?? 0) > 5 && (
            <Center>
              <Link href={ROUTES_SEARCH()} passHref>
                <Button variant='light' leftIcon={<Eye height={16} width={16} />}>
                  {t('software:section_button_show_all')}
                </Button>
              </Link>
            </Center>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default SoftwareSection

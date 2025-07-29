import {GridItem, SimpleGrid, useTheme, Box, VStack} from '@chakra-ui/react'
import {SchemaSoftwareSourceCode} from '../Form/schema'
import SoftwareImage from './DetailsGrid/SoftwareImage'
import SoftwareInfo from './DetailsGrid/SoftwareInfo'
import Overview from './Tabs/Overview'
import InputAndProcessingAndOutput from './Tabs/InputAndProcessingAndOutput'
import TechnicalDetails from './Tabs/TechnicalDetails'
import AuthorsAndPublications from './Tabs/AuthorsAndPublications'

interface Props {
  software: SchemaSoftwareSourceCode
}

export interface SoftwareLinks {
  title: string
  link: string
}

const softwarePublicationLinks = [] as SoftwareLinks[]
const relatedWorkLinks = [] as SoftwareLinks[]


const DetailsGrid = ({software}: Props) => {
  const theme = useTheme()

  const ImageSection = (
    <GridItem
      order={{base: 1, md: 1}}
      colSpan={{base: 2, lg: 3}}
      borderRadius='big'
      overflow='hidden'>
      <Box w='full' borderRadius='big' overflow='hidden'>
        <SoftwareImage software={software} />
      </Box>
    </GridItem>
  )

  const DetailsSection = (
    <GridItem
      order={{base: 2, md: 1}}
      colSpan={{base: 2, lg: 1}}
      rowSpan={2}
      bgColor={theme.colors.brand.background}
      borderRadius='big'
      overflow='hidden'
      alignSelf="start">
      <SoftwareInfo software={software} />
    </GridItem>
  )

  const ContentSection = (
    <GridItem
      order={{base: 3, md: 2}}
      colSpan={{base: 2, lg: 3}}
      bgColor={theme.colors.brand.background}
      borderRadius='big'
      overflow='hidden'>
      <VStack w='full' spacing={8} py={8} px={{ base: 4, lg: 8 }}>
        <Overview software={software} />
        <InputAndProcessingAndOutput software={software} />
        <TechnicalDetails software={software} />
        <AuthorsAndPublications
          software={software}
          softwarePublicationLinks={softwarePublicationLinks}
          relatedWorkLinks={relatedWorkLinks}
        />
        {/* <ContactAndSupport software={software} /> */}
      </VStack>
    </GridItem>
  )

  return (
    <SimpleGrid columns={{base: 2, lg: 4}} columnGap={8} rowGap={4}>
      {ImageSection}
      {DetailsSection}
      {ContentSection}
    </SimpleGrid>
  )
}

export default DetailsGrid

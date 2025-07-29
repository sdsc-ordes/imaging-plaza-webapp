import { Box, Text, VStack, Divider, Heading, SimpleGrid } from '@chakra-ui/react'

import { SchemaSoftwareSourceCode } from '../../Form/schema'
import { KeywordItem } from './Components/KeywordItem'
import LinkItem from './Components/LinkItem'
import useTranslation from 'next-translate/useTranslation'
  

interface Props {
  software: SchemaSoftwareSourceCode
}

const Overview = ({ software }: Props) => {
  const { t } = useTranslation()

  
  // const theme = useTheme()

  return (
    <VStack w='full' alignItems='flex-start' spacing={10}>
      <Box alignItems='flex-start'>
        <Heading variant='h5' color='brand.primary' mb={4}>
          {t('software:details_tab_overview')}
        </Heading>
        {software['schema:description'] && (
          <Text>{software['schema:description']}</Text>
        )}
      </Box>

      {/* Feature list and Application category in a grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
        {/* Feature list it's a list schema:featureList */}
        {software['schema:featureList'] && (
          <KeywordItem title={t('schema:featureList_label')} keywords={software['schema:featureList']} />
        )}

        {/* Application category schema:applicationCategory. This should be a list. */}
        {software['schema:applicationCategory'] && (
          <KeywordItem title={t('schema:applicationCategory_label')} keywords={software['schema:applicationCategory']} />
        )}
      </SimpleGrid>

      {/* Based on schema:isBasedOn */}
      {software['schema:isBasedOn'] && (
        <LinkItem 
          title={t('schema:isBasedOn_label')}
          link={software['schema:isBasedOn']}
          linkText={t('software:isBasedOn_linkText')}
        />
      )}

      {/* Based on imag:isPluginModuleOf */}
      {software['imag:isPluginModuleOf'] && (
        <LinkItem 
          title={t('schema:isPluginModuleOf_label')}
          link={software['imag:isPluginModuleOf'][0]}
          linkText={t('software:isPluginModuleOf_linkText')}
        />
      )}


      <Divider />
    </VStack>
  )
}

export default Overview

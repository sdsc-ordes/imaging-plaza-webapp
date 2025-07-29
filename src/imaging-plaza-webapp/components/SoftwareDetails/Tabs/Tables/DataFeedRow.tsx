import { Link, Box, Text, VStack, HStack, Icon, Button, Wrap } from '@chakra-ui/react'
import { DataFeed } from '../../../Form/schema'
import { validate } from '@coteries/utils'
import { Schemas } from '../../../../utils/schema-utils'
import Gauge from '../../../Icons/solid/gauge-simple-solid.svg'
import Ruler from '../../../Icons/solid/Ruler.svg'
import Image from '../../../Icons/light/Image.svg'
import Variable from '../../../Icons/solid/Variable.svg'
import Cubes from '../../../Icons/solid/Cubes.svg'
import ExternalLink from '../../../Icons/regular/ExternalLink.svg'
import Hand from '../../../Icons/solid/hand-pointer-solid.svg'
import FileCode from '../../../Icons/solid/file-code-solid.svg'
import useTranslation from 'next-translate/useTranslation'
import VariableItem from '../Components/VariableItem'


// const isParameter = validate<Parameter>(obj => obj['@type'] === Schemas.FormalParameter)
const isDataFeed = validate<DataFeed>(obj => obj['@type'] === Schemas.DataFeed)

const DataFeedCard = ({ dataFeed }: { dataFeed: DataFeed }) => {
  const { t } = useTranslation()

  return (
    <Link
      href={dataFeed['schema:contentUrl']}
      isExternal
      display="block"
      w="100%"
    >
      <Box
        py={4}
        px={2}
        borderWidth="1px"
        borderRadius="md"
        backgroundColor="brand.white"
        h="full"
        transition="all 0.2s"
        _hover={{
          boxShadow: 'md',
        }}
      >
        <VStack spacing={6} align="start" justify="space-between">
          <VStack spacing={3} align="start">
            <Text variant='semiBold' noOfLines={1}>{dataFeed['schema:name']}</Text>
            <HStack spacing={1} >
              <Text variant='regular' color="brand.grey">{dataFeed['schema:description']}</Text>
            </HStack>
          </VStack>
          <VStack spacing={3} align="start">
            <Wrap spacing={4} align="center">
              {dataFeed['schema:measurementTechnique'] && (
                <VariableItem
                  text={dataFeed['schema:measurementTechnique']}
                  label={t('schema:measurementTechnique_label')}
                  icon={Ruler}
                />
              )}
              {dataFeed['schema:variableMeasured'] && (
                <VariableItem
                  text={dataFeed['schema:variableMeasured']}
                  label={t('schema:variableMeasured_label')}
                  icon={Variable}
                />
              )}
              {dataFeed['sd:hasDimensionality'] && (
                <VariableItem
                  text={dataFeed['sd:hasDimensionality'].toString()}
                  label={t('schema:hasDimensionality_label')}
                  icon={Cubes}
                />
              )}
              {dataFeed['dmib:hasPhysicalQuantity'] && (
                <VariableItem
                  text={dataFeed['dmib:hasPhysicalQuantity']}
                  label={t('schema:hasPhysicalQuantity_label')}
                  icon={Gauge}
                />
              )}
              {dataFeed['imag:resolution'] && (
                <VariableItem
                  text={dataFeed['imag:resolution']}
                  label={t('schema:resolution_label')}
                  icon={Image}
                />
              )}
              {dataFeed['sphn:bodySite'] && (
                <VariableItem
                  text={dataFeed['sphn:bodySite']}
                  label={t('schema:bodySite_label')}
                  icon={Hand}
                />
              )}
              {dataFeed['imag:datasetFormat'] && (
                <VariableItem
                  text={dataFeed['imag:datasetFormat']}
                  label={t('schema:datasetFormat_label')}
                  icon={FileCode}
                />
              )}
            </Wrap>
            {dataFeed['imag:imagingModality'] && (
              <Wrap w='full' spacing={2}>
                {dataFeed['imag:imagingModality'].map((keyword, index) => (
                  <Link href={`/search?query=${keyword}`} key={index}>
                    <Button variant='keywords' minW='fit-content'>
                      {keyword}
                    </Button>
                  </Link>
                ))}
              </Wrap>)}

          </VStack>


          <HStack spacing={1}>
            <Button variant='link' color="brand.primary">
              {t('software:details_see_dataset')}
            </Button>
            <Icon as={ExternalLink} color="brand.primary" boxSize={3} />
          </HStack>
        </VStack>
      </Box>
    </Link>
  )
}
export const DataFeedRow = ({ dataFeed }: { dataFeed: DataFeed }) => {
  if (isDataFeed(dataFeed)) return <DataFeedCard dataFeed={dataFeed} />
  else return null
}
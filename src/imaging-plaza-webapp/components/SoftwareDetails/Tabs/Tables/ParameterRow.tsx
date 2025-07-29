import React from 'react'
import { Box, Text, HStack, Link, VStack, Icon, Button } from '@chakra-ui/react'
import { validate } from '@coteries/utils'
import { Schemas } from '../../../../utils/schema-utils'
import { Parameter } from '../../../Form/schema'
import AlignLeft from '../../../Icons/light/AlignLeft.svg'
import File from '../../../Icons/solid/File.svg'
import Check from '../../../Icons/regular/Check.svg'
import ExternalLink from '../../../Icons/regular/ExternalLink.svg'
import Cubes from '../../../Icons/solid/Cubes.svg'
import Variable from '../../../Icons/solid/Variable.svg'
import useTranslation from 'next-translate/useTranslation'
import VariableItem from '../Components/VariableItem'

const isParameter = validate<Parameter>(obj => obj['@type'] === Schemas.FormalParameter)

const RowParameter = ({ parameter }: { parameter: Parameter }) => {
  const { t } = useTranslation()

  return (
    <Link
      href={parameter['schema:encodingFormat']}
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
        transition="all 0.2s"
        h="full"
        _hover={{
          boxShadow: 'md',
        }}
      >
        <VStack spacing={6} align="start" justify="space-between">
          <VStack spacing={3} align="start">
            <Text variant='semiBold' noOfLines={1}>{parameter['schema:name']}</Text>

            <HStack spacing={4} align="center" flexWrap="wrap">
              {parameter['schema:description'] && (
                <VariableItem
                  text={parameter['schema:description']}
                  label={t('schema:description_label')}
                  icon={AlignLeft}
                />
              )}

              {parameter['sd:hasFormat'] && (
                <VariableItem
                  text={parameter['sd:hasFormat']}
                  label={t('schema:hasFormat_label')}
                  icon={File}
                />
              )}

              {parameter['sd:hasDimensionality'] && (
                <VariableItem
                  text={parameter['sd:hasDimensionality'].toString()}
                  label={t('schema:hasDimensionality_label')}
                  icon={Cubes}/>

              )}

              {parameter['schema:defaultValue'] && (
                <VariableItem
                  text={parameter['schema:defaultValue']}
                  label={t('schema:defaultValue_label')}
                  icon={Variable}/>
              )}

              {parameter['schema:valueRequired'] && (
                <VariableItem
                  text={parameter['schema:valueRequired'] ? 'Is Required' : 'Not Required'}
                  label={t('schema:valueRequired_label')}
                  icon={Check}/>
              )}

            </HStack>
          </VStack>
          <HStack spacing={1}>
            <Button variant='link' color="brand.primary">
              {t('software:details_see_encoding_format')}
            </Button>
            <Icon as={ExternalLink} color="brand.primary" boxSize={3} />
          </HStack>
        </VStack>
      </Box>
    </Link >
  )
}

export const ParameterRow = ({ parameter }: { parameter: Parameter }) => {
  if (isParameter(parameter)) return <RowParameter parameter={parameter} />
  else return null
}

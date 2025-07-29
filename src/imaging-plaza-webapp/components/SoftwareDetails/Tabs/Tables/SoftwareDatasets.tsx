import {
  Box,
  Button,
  Table,
  Flex,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Link,
} from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import {useIsDesktop} from '../../../../hooks/useIsDesktop'
import ExternalLink from '../../../Icons/regular/ExternalLink.svg'
import {SchemaSoftwareSourceCode} from '../../../Form/schema'

interface Props {
  software: SchemaSoftwareSourceCode
}

const SoftwareDatasets = ({software}: Props) => {
  const {t} = useTranslation()
  const isDesktop = useIsDesktop()

  return (
    <>
      {software['sd:hasParameter'] && !isEmpty(software['sd:hasParameter']) && (
        <VStack w='full' alignItems='flex-start' spacing={5}>
          <Text variant='large'>{t('software:input_minimum_usable_datasets')}</Text>
          <Flex w='full'>
            <Box
              borderRadius='small'
              overflowX='scroll'
              w={isDesktop ? 'auto' : 'full'}
              className='hide-scrollbar'>
              <Table variant='light'>
                <Thead>
                  <Tr>
                    <Th>{t('software:input_name')}</Th>
                    <Th>{t('software:input_description')}</Th>
                    <Th>{t('software:input_download_link')}</Th>
                    <Th>{t('software:input_measurement_tech')}</Th>
                    <Th>{t('software:input_measured_variable')}</Th>
                    <Th>{t('software:input_data_license')}</Th>
                    <Th>{t('software:input_keywords')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {([] as any).map(
                    (
                      inputs: any //TODO fix this
                    ) => (
                      <Tr key={inputs.name}>
                        <Td w={136}>{inputs.name}</Td>
                        <Td w={300}>{inputs.description}</Td>

                        <Td w={300}>
                          {inputs.downloadLink && (
                            <Link isExternal href={inputs.downloadLink}>
                              <Button
                                variant='outlined'
                                rightIcon={<ExternalLink height={16} width={16} />}>
                                {t('software:input_open')}
                              </Button>
                            </Link>
                          )}
                        </Td>

                        <Td w={100}>{inputs.measurementTechnique}</Td>
                        <Td w={100}>{inputs.measuredVariable}</Td>

                        <Td w={100}>
                          {inputs.dataLicense && (
                            <Link isExternal href={inputs.dataLicense}>
                              <Button
                                variant='outlined'
                                rightIcon={<ExternalLink height={16} width={16} />}>
                                {t('software:input_open')}
                              </Button>
                            </Link>
                          )}
                        </Td>

                        <Td w={100}>{inputs.keywords}</Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </VStack>
      )}
    </>
  )
}
export default SoftwareDatasets

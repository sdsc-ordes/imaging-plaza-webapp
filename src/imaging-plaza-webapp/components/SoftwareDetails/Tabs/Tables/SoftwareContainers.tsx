import {Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack} from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import {useIsDesktop} from '../../../../hooks/useIsDesktop'
import {SchemaSoftwareSourceCode} from '../../../Form/schema'

interface Props {
  software: SchemaSoftwareSourceCode
}

const SoftwareContainers = ({software}: Props) => {
  const {t} = useTranslation()
  const isDesktop = useIsDesktop()

  return (
    <>
      {software['sd:hasSoftwareImage'] && !isEmpty(software['sd:hasSoftwareImage']) && (
        <VStack w='full' alignItems='flex-start' spacing={5}>
          <Text variant='large'>{t('software:input_containers')}</Text>
          <Flex w='full'>
            <Box
              borderRadius='small'
              overflowX='scroll'
              w={isDesktop ? 'auto' : 'full'}
              className='hide-scrollbar'>
              <Table variant='light'>
                <Thead>
                  <Tr>
                    <Th>{t('software:input_registry')}</Th>
                    <Th>{t('software:input_name')}</Th>
                    <Th>{t('software:input_description')}</Th>
                    <Th>{t('software:input_software_version')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {software['sd:hasSoftwareImage'].map(inputs => (
                    <Tr key={inputs['schema:name']}>
                      <Td w={136}>{inputs['sd:availableInRegistry']}</Td>
                      <Td w={136}>{inputs['schema:name']}</Td>
                      <Td w={300}>{inputs['schema:description']}</Td>
                      <Td w={100}>{inputs['schema:softwareVersion']}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </VStack>
      )}
    </>
  )
}
export default SoftwareContainers

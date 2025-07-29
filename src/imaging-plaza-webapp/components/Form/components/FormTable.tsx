import {
  Center,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useTheme,
  VStack,
} from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import {getTypeName} from '../../../utils/schema-utils'
import Trash from '../../Icons/regular/Trash.svg'
import Pen from '../../Icons/solid/Pen.svg'

const toString = (elem: any) => {
  switch (typeof elem) {
    case 'string':
    case 'number':

    case 'boolean':
    case 'symbol':
    case 'bigint':
      return elem.toString()
    case 'function':
      return ''
    case 'undefined':
      return ''
    case 'object':
      return JSON.stringify(elem)
  }
}
interface Props<FormType> {
  titles: string[]
  titleKeys: string[]
  elements: FormType[]
  elementsWithNameKeys?: string[]
  placeholder: string
  onEdit: (val: number) => void
  onDelete: (val: number) => void
  label: string
  required?: boolean
}

const FormTable = <FormType extends Object>({
  titles,
  titleKeys,
  elements,
  elementsWithNameKeys,
  placeholder,
  onEdit,
  onDelete,
  required = false,
}: Props<FormType>) => {
  const {t} = useTranslation('schema')
  const theme = useTheme()
  
  return (
    <VStack
      backgroundColor={theme.colors.brand.white}
      mt={4}
      w='full'
      overflowX='scroll'
      align='stretch'
      borderRadius='big'
      position='relative'
      border={required && elements?.length === 0 ? `1px solid ${theme.colors.brand.red}` : ''}>
      <TableContainer w='full'>
        <Table variant='simple' overflowX='scroll'>
          <Thead>
            <Tr>
              {titles.map(title => (
              <Th key={title} fontWeight='semibold' fontSize='small'>
                {t(`${getTypeName(title)}_label`)}
              </Th>
              ))}
              <Th textAlign='end' fontWeight='semibold' fontSize='small'>
              {t('general_table_action')}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {elements.map((element, index) => (
              <Tr key={index}>
                {titleKeys.map((title, i) => {
                  if (elementsWithNameKeys?.includes(title) && element.hasOwnProperty(title)) {
                    return (
                      <Td
                        key={`${index}-${title}-${i}`}
                        minW={title === 'description' ? '300px' : 'auto'}>
                        {
                          // @ts-ignore
                          element[title] && element[title].map(x => t(`${x.nameKey}`)).join(', ')
                        }
                      </Td>
                    )
                  }
                  return (
                    <Td
                      key={`${index}-${title}-${i}`}
                      // @ts-ignore
                      minW={title === 'description' ? '300px' : 'auto'}>
                      {toString((element as any)[title])}
                    </Td>
                  )
                })}
                <Td isNumeric>
                  <Flex justify='end' gap={2}>
                    <IconButton
                      size='sm'
                      variant='link'
                      color={theme.colors.brand.primary}
                      icon={<Pen width={12} height={12} />}
                      aria-label='edit'
                      onClick={() => onEdit(index)}
                    />
                    <IconButton
                      size='sm'
                      variant='link'
                      _hover={{
                        color: theme.colors.brand.red,
                      }}
                      color={theme.colors.brand.red}
                      icon={<Trash width={12} height={12} />}
                      aria-label='delete'
                      onClick={() => onDelete(index)}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
            {isEmpty(elements) && (
              <Tr h='150px'>
                <Td colSpan={titleKeys.length} w='full' justifyContent='center' alignItems='center'>
                  <Center position='absolute' w='full'>
                    <Text>{placeholder}</Text>
                  </Center>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}

export default FormTable

import {Divider, Heading, Spacer, Stack, Text, useTheme, VStack} from '@chakra-ui/react'
import {PropsWithChildren} from 'react'

interface Props
  extends PropsWithChildren<{
    title: string
    description?: string
    first?: boolean
  }> {}

// First makes the title underlined. 

const FormTitle = ({title, description, first = false, children}: Props) => {
  const theme = useTheme()

  return (
    <VStack w='full' alignItems='start' spacing={4}>
      {!first && <Divider pt={4} borderColor={theme.colors.brand.lightGrey} />}
      <Stack w='full' direction='row' justifyContent='space-between'>
        <Heading variant={first ? 'h4' : 'h6'}>{title}</Heading>
        <Spacer />
        {first && (
          <Text m='0' variant='description'>
            Required *
          </Text>
        )}
        {children}
      </Stack>
      {description && <Text variant='description'>{description}</Text>}
      {first && <Divider pt={4} borderColor={theme.colors.brand.lightGrey} />}
    </VStack>
  )
}

export default FormTitle

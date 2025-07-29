import {Box, Text, useTheme, VStack} from '@chakra-ui/react'
import Image from 'next/image'

interface Props {
  placeholder: any
  text: string
}

const Placeholder = ({placeholder, text}: Props) => {
  const theme = useTheme()

  return (
    <VStack my={16}>
      <Box>
        <Image src={placeholder} width={116} height={106} alt='logo-header' />
      </Box>
      <Text variant='medium' color={theme.colors.brand.grey} maxW={336} align='center'>
        {text}
      </Text>
    </VStack>
  )
}

export default Placeholder

import {Box, Flex, Text, useTheme} from '@chakra-ui/react'

interface Props {
  icon: any
  text: string
}

const DetailsWithIcon = ({icon, text}: Props) => {
  const theme = useTheme()

  return (
    <Flex w='full' direction='row' gap={2.5} placeItems='center'>
      <Box color={theme.colors.brand.textColor}>{icon}</Box>
      <Box overflowX='hidden' flexGrow={1}>
        <Text noOfLines={2}>{text}</Text>
      </Box>
    </Flex>
  )
}

export default DetailsWithIcon

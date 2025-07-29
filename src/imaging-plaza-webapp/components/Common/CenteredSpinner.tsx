import {Center, Spinner, useTheme} from '@chakra-ui/react'

const CenteredSpinner = () => {
  const theme = useTheme()
  return (
    <Center w='full' h='full' minH='50vh'>
      <Spinner size='xl' color={theme.colors.brand.primary} />
    </Center>
  )
}

export default CenteredSpinner

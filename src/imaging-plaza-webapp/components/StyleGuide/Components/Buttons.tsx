import {Button, HStack, useTheme} from '@chakra-ui/react'

const Buttons = () => {
  const theme = useTheme()

  return (
    <HStack
      border='1px dashed #00B880'
      bg={theme.colors.brand.white}
      justifyContent='start'
      spacing={10}
      p={10}>
      <Button variant='searchBig'>searchBig</Button>
      <Button variant='primary'>primary</Button>
      <Button variant='light'>light</Button>
      <Button variant='outlined'>outlined</Button>
      <Button variant='ghost'>ghost</Button>
    </HStack>
  )
}

export default Buttons

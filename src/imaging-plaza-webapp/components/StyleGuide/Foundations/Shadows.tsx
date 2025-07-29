import {Center, Text, useTheme, Wrap} from '@chakra-ui/react'

const Shadows = () => {
  const theme = useTheme()

  return (
    <Wrap
      w='full'
      spacing={{base: 5, md: 10}}
      justifyItems='start'
      bg={theme.colors.brand.white}
      p={8}
      border='1px dashed #00B880'>
      <Text>Shadows</Text>
      <Center w={100} h={100} borderRadius='full' shadow='heavy'>
        <Text>heavy</Text>
      </Center>
      <Center w={100} h={100} borderRadius='full' justifyContent='center' shadow='big'>
        <Text>big</Text>
      </Center>
      <Center w={100} h={100} borderRadius='full' justifyContent='center' shadow='normal'>
        <Text>normal</Text>
      </Center>
    </Wrap>
  )
}

export default Shadows

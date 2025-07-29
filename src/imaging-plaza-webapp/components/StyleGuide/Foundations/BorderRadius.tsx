import {Text, VStack, Wrap} from '@chakra-ui/react'

const BorderRadius = () => {
  return (
    <Wrap w='full' spacing={{base: 5, md: 10}} justifyItems='start'>
      <Text>Border Radius</Text>
      <VStack borderRadius='big' w={100} h={100} border='1px solid black' justifyContent='center'>
        <Text>Big</Text>
        <Text> 20px</Text>
      </VStack>
      <VStack
        borderRadius='medium'
        w={100}
        h={100}
        border='1px solid black'
        justifyContent='center'>
        <Text>Medium</Text>
        <Text>15px</Text>
      </VStack>
      <VStack borderRadius='small' w={100} h={100} border='1px solid black' justifyContent='center'>
        <Text>Small</Text>
        <Text> 10px</Text>
      </VStack>
    </Wrap>
  )
}
export default BorderRadius

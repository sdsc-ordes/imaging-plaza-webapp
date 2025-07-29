import {Box, Text, useTheme, VStack, Wrap} from '@chakra-ui/react'

const ColorsPalette = () => {
  const theme = useTheme()
  return (
    <>
      <Wrap w='full' spacing={10}>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.primary} borderRadius={10} />
          <Text>
            Primary
            <br />
            primary
          </Text>
        </VStack>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.accentuation} borderRadius={10} />
          <Text>
            Accentuation
            <br />
            accentuation
          </Text>
        </VStack>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.lightGreen} borderRadius={10} />
          <Text>
            Green Light 1<br />
            lightGreen
          </Text>
        </VStack>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.superLightGreen} borderRadius={10} />
          <Text>
            Green Light 2<br />
            superLightGreen
          </Text>
        </VStack>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.background} borderRadius={10} />
          <Text>
            Background
            <br />
            background
          </Text>
        </VStack>
      </Wrap>
      <Wrap w='full' spacing={10}>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.textColor} borderRadius={10} />
          <Text>
            Text color
            <br />
            textColor
          </Text>
        </VStack>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.grey} borderRadius={10} />
          <Text>
            Grey - Normal
            <br />
            grey
          </Text>
        </VStack>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.lightGrey} borderRadius={10} />
          <Text>
            Grey Light 1<br />
            lightGrey
          </Text>
        </VStack>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.superLightGrey} borderRadius={10} />
          <Text>
            Grey Light 2<br />
            superLightGrey
          </Text>
        </VStack>
      </Wrap>
      <Wrap w='full' spacing={10}>
        <VStack spacing={2} alignItems='start'>
          <Box w={100} h={100} bg={theme.colors.brand.red} borderRadius={10} />
          <Text>
            Red
            <br />
            red
          </Text>
        </VStack>
        <VStack spacing={2} alignItems='start'>
          <Box
            w={100}
            h={100}
            bg={theme.colors.brand.white}
            borderRadius={10}
            borderWidth='1px'
            borderColor={theme.colors.brand.textColor}
          />
          <Text>
            White
            <br />
            white
          </Text>
        </VStack>
      </Wrap>
    </>
  )
}

export default ColorsPalette

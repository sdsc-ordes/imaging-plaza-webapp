import {Heading, Stack, Text, useTheme, VStack, Wrap} from '@chakra-ui/react'

const Typography = () => {
  const theme = useTheme()
  return (
    <Wrap w='full' spacing={20}>
      <Stack spacing={10} bgColor={theme.colors.brand.white} p={5} borderRadius='medium'>
        <VStack alignItems='start'>
          <h1>Default - H1</h1>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 57px (mobile 36px) - Letter spacing: 2px
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <h2>Default - H2</h2>
          <Text color={theme.colors.brand.lightGrey}>Inter - Bold - 45px (mobile 25px)</Text>
        </VStack>
        <VStack alignItems='start'>
          <h3>Default - H3</h3>
          <Text color={theme.colors.brand.lightGrey}>Inter - Bold - 36px (mobile 18px)</Text>
        </VStack>
        <VStack alignItems='start'>
          <h4>Default - H4</h4>
          <Text color={theme.colors.brand.lightGrey}>Inter - Bold - 29px (mobile 21px)</Text>
        </VStack>
        <VStack alignItems='start'>
          <h5>Default - H5</h5>
          <Text color={theme.colors.brand.lightGrey}>Inter - Bold - 23px (mobile 18px)</Text>
        </VStack>
        <VStack alignItems='start'>
          <h6>Default - H6</h6>
          <Text color={theme.colors.brand.lightGrey}>Inter - Bold - 18px (mobile 16px)</Text>
        </VStack>
      </Stack>

      <Stack spacing={10} bgColor={theme.colors.brand.white} p={5} borderRadius='medium'>
        <VStack alignItems='start'>
          <Heading as='h1' variant='h1'>
            Display - H1
          </Heading>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 57px (mobile 36px) - Letter spacing: 2px || variant=&apos;h1&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Heading as='h2' variant='h2'>
            Display - H2
          </Heading>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 45px (mobile 25px) || variant=&apos;h2&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Heading as='h3' variant='h3'>
            Display - H3
          </Heading>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 36px (mobile 18px) || variant=&apos;h3&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Heading as='h4' variant='h4'>
            Display - H4
          </Heading>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 29px (mobile 21px) || variant=&apos;h4&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Heading as='h5' variant='h5'>
            Display - H5
          </Heading>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 23px (mobile 18px) || variant=&apos;h5&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Heading as='h6' variant='h6'>
            Display - H6
          </Heading>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 18px (mobile 16px) || variant=&apos;h6&apos;
          </Text>
        </VStack>
      </Stack>

      <Stack spacing={10} bgColor={theme.colors.brand.white} p={5} borderRadius='medium'>
        <VStack alignItems='start'>
          <Text>Text - Size normal - Regular</Text>
          <Text color={theme.colors.brand.lightGrey}>
            Open Sans - Regular - 15px || variant=&apos;regular&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Text variant='semiBold'>Text - Size normal - SemiBold</Text>
          <Text color={theme.colors.brand.lightGrey}>
            Open Sans - SemiBold - 15px || variant=&apos;semiBold&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Text variant='small'>Text - Size small - Regular</Text>
          <Text color={theme.colors.brand.lightGrey}>
            Open Sans - Regular - 12px || variant=&apos;small&apos;
          </Text>
        </VStack>
      </Stack>

      <Stack spacing={10} bgColor={theme.colors.brand.white} p={5} borderRadius='medium'>
        <VStack alignItems='start'>
          <Text variant='searchTitle'>Special - Search title</Text>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 15px - Letter spacing: 0.5px || variant=&apos;searchTitle&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Text variant='searchInput'>Special - Search input</Text>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 24px - Letter spacing: 0.5px || variant=&apos;searchInput&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Text variant='label'>Special - Label</Text>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 11px || variant=&apos;label&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Text variant='socialNumberCard'>Special - Card social numbers</Text>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 13px || variant=&apos;socialNumberCard&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Text variant='socialNumberDetails'>Special - Details social numbers</Text>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 15px || variant=&apos;socialNumberDetails&apos;
          </Text>
        </VStack>
        <VStack alignItems='start'>
          <Text variant='bigNumber'>Special - Fair Level Nb</Text>
          <Text color={theme.colors.brand.lightGrey}>
            Inter - Bold - 50px || variant=&apos;bigNumber&apos;
          </Text>
        </VStack>
      </Stack>
    </Wrap>
  )
}
export default Typography

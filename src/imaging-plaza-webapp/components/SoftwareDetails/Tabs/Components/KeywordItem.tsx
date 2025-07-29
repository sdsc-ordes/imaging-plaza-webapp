import { Text, Link, Button, Box, VStack, Wrap } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'

interface KeywordItemProps {
  title: string
  description?: string
  keywords?: string[]
}

export const KeywordItem = ({ title, description, keywords }: KeywordItemProps) => {
  if (!keywords || isEmpty(keywords)) return null

  return (
    <Box 
      py={4}
      px={2}
      borderWidth="1px"
      borderRadius="md"
      // borderColor='brand.lightGreen'
      backgroundColor="brand.white"
      h="full"
    >
      <VStack direction='column' w='full'  justify="space-between" spacing={3}>
        <VStack spacing={3} align="start" w="full">
          <Text variant='semiBold' noOfLines={1}>
            {title}
          </Text>
        </VStack>
        <Wrap w='full' spacing={2}>
          {keywords.map((keyword, index) => (
            <Link href={`/search?query=${keyword}`} key={index}>
              <Button variant='keywords' minW='fit-content'>
                {keyword}
              </Button>
            </Link>
          ))}
        </Wrap>
      </VStack>
    </Box>
  )
} 
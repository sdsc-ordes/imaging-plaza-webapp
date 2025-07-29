import { HStack, Text, Box } from "@chakra-ui/react"

interface TextItemProps {
    title: string
    text?: string
}

const TextItem = ({title, text}: TextItemProps) => {
    
    return (
      <>
        {text && (
        <Box alignItems='flex-start'>
        <HStack spacing={4} align="center">
          <Text variant='semiBold'> 
            {title}
          </Text>
            <Text >
              {text}
            </Text>
        </HStack>
        </Box>
        )}
      </>
    )
  } 

export default TextItem
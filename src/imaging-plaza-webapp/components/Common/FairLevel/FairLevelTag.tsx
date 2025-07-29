import {Box, HStack, Text} from '@chakra-ui/react'
import {FairLevelSvg} from './FairLevelSvg'

type FairLevelTagProps = {
  level: string | number
}

const FairLevelTag = ({level}: FairLevelTagProps) => {

  if (level === 0) return null
  return (
    <HStack
      h='2.25rem'
      borderRadius='full'
      border='2px solid'
      borderColor='brand.primary'
      bg='brand.white'
      py={0}
      px='11px'
      spacing={0}>
      <FairLevelSvg w='5' h='5' />
      <Box margin='auto' borderRadius='full' display='flex' alignItems='center' ml='2'>
        <Text color='brand.primary' variant='large' w='full' textAlign='center'>
          {level}
        </Text>
      </Box>
    </HStack>
  )
}

export default FairLevelTag

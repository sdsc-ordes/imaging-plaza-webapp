import {Divider, HStack, Text} from '@chakra-ui/react'

interface Props {
  text: string
}

const SearchDivider = ({text}: Props) => {
  return (
    <HStack w='100%' mt='40px' mb='30px'>
      <Divider border='0.5px solid #C5CBD3' />
      <Text fontWeight='bold' whiteSpace='nowrap' color='#81868F' px='10px'>
        {text}
      </Text>
      <Divider border='0.5px solid #C5CBD3' />
    </HStack>
  )
}

// noinspection JSUnusedGlobalSymbols
export default SearchDivider

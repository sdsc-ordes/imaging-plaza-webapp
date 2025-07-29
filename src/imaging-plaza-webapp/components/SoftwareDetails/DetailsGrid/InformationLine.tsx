import {Box, HStack} from '@chakra-ui/react'
import type {ReactNode} from 'react'

interface Props {
  icon: any
  children: ReactNode
}

const InformationLine = ({icon, children}: Props) => {
  return (
    <HStack align='flex-start' w='full' style={{marginTop: 0}}>
      <Box minW={5} mr={1} mt={1}>
        {icon}
      </Box>
      {children}
    </HStack>
  )
}

export default InformationLine

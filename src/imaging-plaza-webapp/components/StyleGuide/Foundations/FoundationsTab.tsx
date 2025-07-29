import {Divider, VStack} from '@chakra-ui/react'
import BorderRadius from './BorderRadius'
import ColorsPalette from './ColorsPalette'
import Shadows from './Shadows'
import Typography from './Typography'

const FoundationsTab = () => {
  return (
    <VStack w='full' justifyContent='start' spacing={20} my={10}>
      <Typography />
      <Divider />
      <ColorsPalette />
      <Divider />
      <BorderRadius />
      <Divider />
      <Shadows />
    </VStack>
  )
}

export default FoundationsTab

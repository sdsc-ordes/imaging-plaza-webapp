import {Divider, VStack} from '@chakra-ui/react'
import Buttons from './Buttons'
import DiverseComponents from './DiverseComponents'
import FormElements from './FormElements'

const ComponentsTab = () => {
  return (
    <VStack w='full' spacing={10} my={10}>
      <Buttons />
      <Divider />
      <FormElements />
      <Divider />
      <DiverseComponents />
    </VStack>
  )
}

export default ComponentsTab

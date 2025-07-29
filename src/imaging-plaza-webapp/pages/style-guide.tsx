import {Heading, Tab, TabList, TabPanel, TabPanels, Tabs, VStack} from '@chakra-ui/react'
import ComponentsTab from '../components/StyleGuide/Components/ComponentsTab'
import FoundationsTab from '../components/StyleGuide/Foundations/FoundationsTab'
import PatternsTab from '../components/StyleGuide/PatternsTab'

const StyleGuide = () => {
  return (
    <VStack w='full' h='100vh' p={{base: 3, md: 20}} alignItems='start' spacing={10}>
      <Heading>Style Guide</Heading>
      <Tabs w='full'>
        <TabList>
          <Tab>Foundations</Tab>
          <Tab>Components</Tab>
          <Tab>Patterns</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FoundationsTab />
          </TabPanel>
          <TabPanel>
            <ComponentsTab />
          </TabPanel>
          <TabPanel>
            <PatternsTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

// noinspection JSUnusedGlobalSymbols
export default StyleGuide

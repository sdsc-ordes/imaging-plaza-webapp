import {
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useTheme,
  VStack,
} from '@chakra-ui/react'
import FairLevelTag from '../../Common/FairLevel/FairLevelTag'

const DiverseComponents = () => {
  const theme = useTheme()
  return (
    <>
      <HStack w='full' justifyContent='start' spacing={10}>
        <VStack bg={theme.colors.brand.white} p={8} border='1px dashed #00B880' w={600}>
          <Tabs w='full' variant='primary'>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>User Guidelines</Tab>
              <Tab>Tab3</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>Overview</TabPanel>
              <TabPanel>User Guidelines</TabPanel>
              <TabPanel>Tab3</TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </HStack>
      <HStack w='full' justifyContent='start' spacing={10}>
        <VStack bg={theme.colors.brand.superLightGreen} p={8} border='1px dashed #00B880'>
          <FairLevelTag level='5' />
          <Text variant='fairLevelInputTag'>FAIR level 5</Text>
        </VStack>
      </HStack>
    </>
  )
}

export default DiverseComponents

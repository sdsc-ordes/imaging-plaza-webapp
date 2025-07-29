import {
  Checkbox,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Text,
  Textarea,
  useTheme,
  VStack,
} from '@chakra-ui/react'

const FormElements = () => {
  const theme = useTheme()

  return (
    <>
      <HStack w='full' justifyContent='start' spacing={10}>
        <VStack bg={theme.colors.brand.superLightGreen} p={8} border='1px dashed #00B880'>
          <Input placeholder='Write text' />
        </VStack>
        <VStack bg={theme.colors.brand.superLightGreen} p={8} border='1px dashed #00B880'>
          <Textarea placeholder='Write text' />
        </VStack>
        <VStack bg={theme.colors.brand.superLightGreen} p={8} border='1px dashed #00B880'>
          <Select placeholder='Write text'>
            <option value='value1'>Option 1</option>
            <option value='value2'>Option 2</option>
            <option value='value3'>Option 2</option>
          </Select>
        </VStack>
      </HStack>
      <HStack w='full' justifyContent='start' spacing={10}>
        <VStack bg={theme.colors.brand.white} p={10} border='1px dashed #00B880'>
          <Checkbox>
            <Text>Label</Text>
          </Checkbox>
          <Checkbox isChecked={true}>
            <Text>Label</Text>
          </Checkbox>
          <Checkbox isDisabled={true}>
            <Text>Label</Text>
          </Checkbox>
        </VStack>
        <RadioGroup defaultValue='1'>
          <VStack bg={theme.colors.brand.white} p={8} border='1px dashed #00B880'>
            <Radio value='1'>
              <Text>Label</Text>
            </Radio>
            <Radio value='2'>
              <Text>Label</Text>
            </Radio>
            <Radio value='3' isDisabled={true}>
              <Text>Label</Text>
            </Radio>
          </VStack>
        </RadioGroup>
        <VStack bg={theme.colors.brand.white} p={8} border='1px dashed #00B880'>
          <HStack>
            <Switch />
            <Text>Label</Text>
          </HStack>
          <HStack>
            <Switch isChecked={true} />
            <Text>Label</Text>
          </HStack>
          <HStack>
            <Switch isDisabled={true} />
            <Text>Label</Text>
          </HStack>
        </VStack>
      </HStack>
    </>
  )
}

export default FormElements

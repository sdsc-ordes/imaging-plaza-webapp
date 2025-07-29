import {ChakraStylesConfig} from 'chakra-react-select'

export const chakraStyles: ChakraStylesConfig = {
  indicatorsContainer: provided => ({
    ...provided,
    borderColor: '',
    color: 'brand.primary',
  }),
  dropdownIndicator: provided => ({
    ...provided,
    bg: 'white',
    color: 'brand.primary',
    textAlign: 'end',
  }),
  menu: () => ({}),
  menuList: provided => ({
    ...provided,
    borderRadius: 'medium',
    px: 0,
    zIndex: 100,
  }),
  multiValue: provided => ({...provided, bg: 'brand.superLightGreen'}),
  multiValueLabel: provided => ({
    ...provided,
  }),
  valueContainer: provided => ({
    ...provided,
    bg: 'white',
  }),
  control: provided => ({
    ...provided,
    borderLeftRadius: 'big',
    borderRightRadius: 'big',
    zIndex: 10000,
    bg: 'white',
    border: 'none',
  }),

  clearIndicator: provided => ({
    ...provided,
    color: 'brand.lightGrey',
    _hover: {
      ...provided,
      color: 'brand.grey',
    },
  }),
}

const Radio = {
  baseStyle: {
    control: {
      borderColor: 'brand.textColor',
      borderWidth: '0.05rem',
      _hover: {
        borderColor: 'brand.primary',
      },
      _focus: {
        ring: 'none',
      },
      _checked: {
        backgroundColor: 'brand.primary',
        borderColor: 'brand.primary',
        _hover: {
          backgroundColor: 'brand.primary',
          borderColor: 'brand.primary',
        },
      },
      _disabled: {
        borderColor: 'brand.textColor',
        _hover: {
          borderColor: 'brand.textColor',
        },
      },
    },
  },
}
export default Radio

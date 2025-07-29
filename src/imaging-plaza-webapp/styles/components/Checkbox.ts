const Checkbox = {
  baseStyle: {
    control: {
      h: '1rem',
      w: '1rem',
      color: 'brand.white',
      ring: 'none',
      borderRadius: '0.25rem',
      borderWidth: '0.05rem',
      borderColor: 'brand.textColor',
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
export default Checkbox

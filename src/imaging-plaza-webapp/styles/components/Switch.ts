const Switch = {
  baseStyle: {
    thumb: {
      bg: 'brand.textColor',
      _checked: {
        bg: 'brand.white',
      },
    },
    track: {
      color: 'brand.white',
      ring: 'none',
      borderWidth: '0.05rem',
      borderColor: 'brand.textColor',
      backgroundColor: 'brand.white',

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

export default Switch

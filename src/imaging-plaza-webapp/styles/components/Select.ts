const Select = {
  variants: {
    white: {
      field: {
        borderRadius: 'full',
        backgroundColor: 'brand.white',
        color: 'brand.textColor',
        '> option': {
          color: 'brand.textColor',
          bgColor: 'brand.white',
        },
        _hover: {
          backgroundColor: 'brand.white',
        },
      },
      option: {
        backgroundColor: 'blue',
      },
      icon: {
        color: 'brand.primary',
      },
    },
  },
  defaultProps: {
    variant: 'white',
  },
}

export default Select

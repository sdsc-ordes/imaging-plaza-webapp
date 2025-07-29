const Input = {
  variants: {
    filled: {
      field: {
        color: 'brand.textColor',
        backgroundColor: 'brand.white',
        borderWidth: '0.05rem',
        borderColor: 'transparent',
        borderRadius: 'full',
        _focus: {
          backgroundColor: 'brand.white',
          borderWidth: '0.0625rem',
          borderColor: 'brand.primary',
        },
        _hover: {
          backgroundColor: 'brand.white',
        },
      },
    },
  },
  defaultProps: {
    variant: 'filled',
  },
}
export default Input

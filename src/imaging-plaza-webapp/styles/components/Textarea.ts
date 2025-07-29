const Textarea = {
  variants: {
    filled: {
      color: 'brand.textColor',
      backgroundColor: 'brand.white',
      borderWidth: '0.05rem',
      borderColor: 'transparent',
      borderRadius: 'medium',
      resize: 'none',
      _focus: {
        backgroundColor: 'brand.white',
        borderWidth: '0.05rem',
        borderColor: 'brand.primary',
      },
      _hover: {
        backgroundColor: 'brand.white',
      },
    },
  },
  defaultProps: {
    variant: 'filled',
  },
}
export default Textarea

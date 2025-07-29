const Tabs = {
  parts: ['tab', 'tablist', 'tabpanel'],
  variants: {
    primary: {
      tab: {
        color: 'brand.textColor',
        fontSize: ['regularM', 'regularM', 'regularM', 'regular'],
        lineHeight: ['1.25rem', '1.25rem', '1.25rem', '1.25rem'],
        boxShadow: 'none',
        borderBottomWidth: '0.25rem',
        borderBottomColor: 'transparent',
        whiteSpace: 'nowrap',
        px: '1.25rem',
        pb: '1.25rem',
        _selected: {
          ring: 'none',
          color: 'brand.primary',
          borderBottomColor: 'brand.primary',
          borderBottomWidth: '0.25rem',
          fontWeight: 'semiBold',
        },
        _hover: {
          color: 'brand.color',
        },
      },
      tablist: {
        mx: 5,
      },
      tabpanel: {
        backgroundColor: 'brand.background',
        borderRadius: 'big',
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
}

export default Tabs

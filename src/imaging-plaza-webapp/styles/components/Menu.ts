const Menu = {
  parts: ['button', 'list', 'item'],
  baseStyle: {
    button: {
      py: '0.25rem',
      px: '0.5rem',
      borderRadius: '0.25rem',
      _hover: {
        backgroundColor: 'brand.lightGrey',
      },
      _active: {
        backgroundColor: 'brand.lightGrey',
      },
    },
    list: {
      backgroundColor: 'brand.white',
      borderRadius: 'small',
      p: '1.5rem 1.5rem 1.5rem 1.5rem',
      border: 'none',
      boxShadow: 'normal',
    },
    item: {
      fontWeight: 'semiBold',
      color: 'brand.textColor',
      py: '0.5rem',
      borderRadius: 'small',
      _hover: {
        opacity: '0.75',
        bg: 'none',
      },
      _focus: {
        bg: 'none',
      },
    },
  },
  variants: {
    sortList: {
      button: {
        py: '0.5rem',
        px: '1rem',
        borderRadius: 'full',
        bg: 'brand.white',
        color: 'brand.primary',
        _hover: {
          backgroundColor: 'brand.superLightGrey',
        },
        _active: {
          backgroundColor: 'brand.superLightGrey',
        },
      },
    },
    light: {
      button: {
        p: 0,
        _hover: {
          backgroundColor: 'none',
        },
        _active: {
          backgroundColor: 'none',
        },
      },
    },
  },
}

export default Menu

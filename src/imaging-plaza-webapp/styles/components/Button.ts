// noinspection JSUnusedGlobalSymbols

const Button = {
  baseStyle: {
    fontWeight: 'semiBold',
    borderRadius: 'full',
    color: 'brand.white',
    _focus: {
      ring: 'none',
    },
    _hover: {
      textDecoration: 'none',
    },
  },
  variants: {
    searchBig: {
      px: '2.5rem',
      py: '1.5rem',
      backgroundColor: 'brand.primary',
      _hover: {
        backgroundColor: 'brand.accentuation',
      },
      _disabled: {
        backgroundColor: 'brand.primary !important',
      },
      _active: {
        backgroundColor: 'brand.primary',
      },
    },
    primary: {
      px: '1.25rem',
      py: '0.5rem',
      bg: 'brand.primary',
      _hover: {
        bg: 'brand.accentuation !important',
      },
      _active: {
        bg: 'brand.primary',
      },
    },
    primaryLeft: {
      px: '1.25rem',
      py: '0.5rem',
      backgroundColor: 'brand.primary',
      borderRightRadius: '0',
      _hover: {
        backgroundColor: 'brand.accentuation',
      },
      _active: {
        backgroundColor: 'brand.primary',
      },
    },
    primaryRight: {
      px: '1.25rem',
      py: '0.5rem',
      backgroundColor: 'brand.primary',
      borderLeft: '0.05rem solid',
      borderColor: 'brand.white',
      borderLeftRadius: '0',
      _hover: {
        backgroundColor: 'brand.accentuation',
      },
      _active: {
        backgroundColor: 'brand.primary',
      },
    },

    light: {
      px: '1.25rem',
      py: '0.5rem',
      color: 'brand.primary',
      backgroundColor: 'brand.superLightGreen',
      _hover: {
        backgroundColor: 'brand.lightGreen',
      },
      _active: {
        backgroundColor: 'brand.superLightGreen',
      },
    },
    outlined: {
      px: '1.25rem',
      py: '0.5rem',
      color: 'brand.primary',
      backgroundColor: 'brand.white',
      border: '0.05rem solid',
      borderColor: 'brand.primary',
      _hover: {
        backgroundColor: 'brand.superLightGreen',
      },
      _active: {
        backgroundColor: 'brand.lightGreen',
      },
    },
    keywords: {
      py: '0.15rem',
      px: '0.5rem',
      borderRadius: 'md',
      color: 'brand.primary',
      fontWeight: '400',
      fontSize: ['regular', 'regular', 'regular', 'regular'],
      lineHeight: ['1.25rem', '1.25rem', '1.25rem', '1.25rem'],
      backgroundColor: 'brand.superLightGreen',
      _hover: {
        backgroundColor: 'brand.lightGreen',
      },
      pointerEvents: 'auto',
      height: 'auto',
    },
    ghost: {
      px: '1.25rem',
      py: '0.5rem',
      borderRadius: 'small',
      color: 'brand.primary',
      backgroundColor: 'transparent',
      _hover: {
        backgroundColor: 'brand.superLightGreen',
      },
      _active: {
        backgroundColor: 'brand.lightGreen',
      },
    },

    navLink: {
      color: 'brand.textColor',
      textTransform: 'uppercase',
      borderRadius: 'full',
      fontWeight: 'bold',
      fontSize: ['navLinkM', 'navLinkM', 'navLinkM', 'navLink'],
      lineHeight: ['1.125rem', '1.125rem', '1.125rem', '1.125rem'],
      _hover: {
        bg: 'brand.background',
      },
      _active: {
        color: 'brand.primary',
      },
    },
    link: {
      color: 'brand.textColor',
      borderLeft: '0',
      borderLeftRadius: '0',
      fontWeight: '400',
      _hover: {
        color: 'brand.primary',
        textDecoration: 'none',
      },
      span: {
        w: 5,
        mr: 4,
        justifyContent: 'center',
      },
      _selected: {
        color: 'brand.accentuation',
        textDecoration: 'none',
      },
      _active: {
        color: 'brand.primary',
      },
    },
    back: {
      h: 14,
      w: 14,
      color: 'brand.textColor',
      bgColor: 'brand.background',
      borderRadius: 'full',
      _hover: {
        color: 'brand.primary',
        bgColor: 'brand.superLightGreen',
      },
    },
    heroButton: {
      h: 14,
      w: 14,
      color: 'brand.white',
      bgColor: 'transparent',
      borderRadius: 'full',
      borderWidth: 1,
    },
  },
}
export default Button

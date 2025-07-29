const Text = {
  baseStyle: {
    fontSize: ['regularM', 'regularM', 'regularM', 'regular'],
    color: 'brand.textColor',
  },
  variants: {
    small: {
      fontSize: ['smallM', 'smallM', 'smallM', 'small'],
      lineHeight: ['1rem', '1rem', '1rem', '1rem'],
    },
    semiBold: {
      fontWeight: 'semiBold',
      fontSize: ['regularM', 'regularM', 'regularM', 'regular'],
      lineHeight: ['1.25rem', '1.25rem', '1.25rem', '1.25rem'],
    },
    regular: {
      fontSize: ['regularM', 'regularM', 'regularM', 'regular'],
      lineHeight: ['1rem', '1rem', '1rem', '1rem'],
    },
    large: {
      fontWeight: 'bold',
      fontSize: ['largeM', 'largeM', 'largeM', 'large'],
      lineHeight: ['1.25rem', '1.25rem', '1.25rem', '1.5rem'],
    },
    bigNumber: {
      fontWeight: 'bold',
      color: 'brand.primary',
      fontSize: ['bigNumberM', 'bigNumberM', 'bigNumberM', 'bigNumber'],
      lineHeight: ['3.75rem', '3.75rem', '3.75rem', '3.75rem'],
    },
    link: {
      color: 'brand.textColor',
      borderLeft: '0',
      borderLeftRadius: '0',
      _hover: {
        color: 'brand.primary',
        textDecoration: 'none',
      },
    },
    socialNumberDetails: {
      fontWeight: 'bold',
      fontSize: [
        'socialNumberDetailsM',
        'socialNumberDetailsM',
        'socialNumberDetailsM',
        'socialNumberDetails',
      ],
      lineHeight: ['1.25rem', '1.25rem', '1.25rem', '1.25rem'],
    },
    socialNumberCard: {
      fontWeight: 'bold',
      fontSize: ['socialNumberCardM', 'socialNumberCardM', 'socialNumberCardM', 'socialNumberCard'],
      lineHeight: ['1rem', '1rem', '1rem', '1rem'],
    },
    label: {
      fontWeight: 'bold',
      fontSize: ['labelM', 'labelM', 'labelM', 'label'],
      lineHeight: ['0.75rem', '0.75rem', '0.75rem', '0.75rem'],
    },
    searchInput: {
      fontWeight: 'bold',
      fontSize: ['searchInputM', 'searchInputM', 'searchInputM', 'searchInput'],
      lineHeight: ['1.5rem', '1.5rem', '1.5rem', '1.75rem'],
    },
    searchTitle: {
      fontWeight: 'bold',
      letterSpacing: 0.5,
      fontSize: ['searchTitleM', 'searchTitleM', 'searchTitleM', 'searchTitle'],
      lineHeight: ['1.25rem', '1.25rem', '1.25rem', '1.25rem'],
    },
    fairLevelInputTag: {
      color: 'brand.primary',
      textAlign: 'center',
      fontSize: ['smallM', 'smallM', 'smallM', 'small'],
      lineHeight: ['1rem', '1rem', '1rem', '1rem'],
      px: 2,
      backgroundColor: 'brand.white',
      borderWidth: '0.25rem',
      borderColor: 'transparent',
      borderRadius: 'full',
    },
    tag: {
      fontSize: ['0.75rem', '0.75rem', '0.75rem', '0.75rem'],
      lineHeight: ['0.75rem', '0.75rem', '0.75rem', '0.75rem'],
      borderWidth: '0.1rem',
      px: '0.5rem',
      py: '0.1rem',
      fontWeight: 'bold',
      color: 'brand.grey',
      borderRadius: 'full',
      borderColor: 'brand.grey',
    },
    footerLink: {
      fontFamily: 'heading',
      fontWeight: '600',
      fontSize: ['footerLinksM', 'footerLinksM', 'footerLinksM', 'footerLinks'],
      lineHeight: ['1.25rem', '1.25rem', '1.25rem', '1.25rem'],
    },
    description: {
      color: 'brand.grey',
      fontSize: ['regularM', 'regularM', 'regularM', 'regular'],
    },
  },
}

export default Text

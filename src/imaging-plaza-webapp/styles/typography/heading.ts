const Heading = {
  baseStyle: {
    color: 'brand.textColor',
  },
  variants: {
    h1: {
      fontSize: ['title1M', 'title1M', 'title1M', 'title1'],
      letterSpacing: '0.125rem',
    },
    h2: {
      fontSize: ['title2M', 'title2M', 'title2M', 'title2'],
    },
    h3: {
      fontSize: ['title3M', 'title3M', 'title3M', 'title3'],
    },
    h4: {
      fontSize: ['title4M', 'title4M', 'title4M', 'title4'],
    },
    h5: {
      fontSize: ['title5M', 'title5M', 'title5M', 'title5'],
    },
    h6: {
      fontSize: ['title6M', 'title6M', 'title6M', 'title6'],
    },
    brandingHero: {
      fontWeight: 'bold',
      letterSpacing: 0.5,
      color: 'brand.white',
      lineHeight: ['1.25rem', '1.25rem', '1.25rem', '1.75rem'],
      fontSize: ['heroSubtitleM', 'heroSubtitleM', 'heroSubtitleM', 'heroSubtitle'],
    },
  },
}
export default Heading

const Table = {
  variants: {
    simple: {
      th: {
        fontFamily: 'body',
        fontWeight: 'bold',
        color: 'brand.textColor',
        textTransform: 'none',
        fontSize: 'regular',
      },
      td: {
        fontFamily: 'body',
        color: 'brand.textColor',
        fontSize: 'regular',
      },
    },
    light: {
      borderCollapse: 'collapse',
      tr: {
        th: {
          whiteSpace: 'nowrap',
          padding: '0.75rem',
          backgroundColor: 'brand.white',
          fontFamily: 'body',
          fontWeight: 'semiBold',
          color: 'brand.textColor',
          textTransform: 'none',
          fontSize: 'regular',
          textAlign: 'left',
          borderBottom: '0.05rem solid',
          borderBottomColor: 'brand.lightGreen',
        },
        td: {
          textAlign: 'left',
          padding: '0.75rem',
          borderTop: '0.05rem solid',
          borderTopColor: 'brand.lightGreen',
          backgroundColor: 'brand.white',
          fontFamily: 'body',
          color: 'brand.textColor',
          fontSize: 'regular',
        },
      },
    },
  },
}

export default Table

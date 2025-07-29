module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'filters', 'licenses'],
    '/': ['software', 'search'],
    '/about': ['about'],
    'rgx:^/account': ['account', 'software'],
    '/contact': ['contact'],
    '/fair-level': ['fair-level'],
    '/faq': ['faq'],
    'rgx:^/manager': ['manager', 'software'],
    '/privacy': ['privacy'],
    '/search': ['search', 'software'],
    'rgx:^/software': ['software', 'fair-level', 'start', 'form', 'schema', 'overview', 'add'],
    '/terms': ['terms'],
  },
  keySeparator: false,
}

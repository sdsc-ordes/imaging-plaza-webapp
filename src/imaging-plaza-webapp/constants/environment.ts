export const isDev = process.env.NODE_ENV === 'development'
export const environment =
  process.env.NEXT_PUBLIC_PROJECTID === 'swiss-data-website-prod'
    ? 'production'
    : isDev
    ? 'development'
    : 'staging'

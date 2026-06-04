const nextTranslate = require('next-translate')
const withBundleAnalyzer = require('@next/bundle-analyzer')

const securityHeaders = [
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
  {key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains'},
]

const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{loader: '@svgr/webpack', options: {typescript: true}}],
    })

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = () => {
  const plugins = [nextTranslate]

  if (process.env.APP_ENV === 'ANALYZE') {
    plugins.push(withBundleAnalyzer())
  }

  return plugins.reduce((acc, plugin) => plugin(acc), {
    ...nextConfig,
  })
}

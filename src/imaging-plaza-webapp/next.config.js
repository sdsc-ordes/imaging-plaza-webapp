const nextTranslate = require('next-translate')
const withBundleAnalyzer = require('@next/bundle-analyzer')

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

import {ChakraProvider, createStandaloneToast} from '@chakra-ui/react'
import {ToastContainer as LibToastContainer} from '@coteries/react/ui'
import PlausibleProvider from 'next-plausible'
import useTranslation from 'next-translate/useTranslation'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import customTheme from '../styles/index'
import '../styles/styles.css'
import {AuthProvider} from '../utils/AuthContext'

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
const plausibleCustomDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_CUSTOM_DOMAIN

function MyApp({Component, pageProps}: AppProps) {
  const {t} = useTranslation()

  const {ToastContainer} = createStandaloneToast()

  return (
    <AuthProvider>
      <ChakraProvider theme={customTheme}>
        <Head>
          <link href='/favicon.ico' />
          <title>{t('common:meta_title_default')}</title>
        </Head>
        <PlausibleProvider
          domain={plausibleDomain ?? 'unset'}
          customDomain={plausibleCustomDomain}
          enabled={!!plausibleDomain}
          trackOutboundLinks
        >
          <Component {...pageProps} />
        </PlausibleProvider>
        <ToastContainer />
        <LibToastContainer />
      </ChakraProvider>
    </AuthProvider>
  )
}

// noinspection JSUnusedGlobalSymbols
export default MyApp

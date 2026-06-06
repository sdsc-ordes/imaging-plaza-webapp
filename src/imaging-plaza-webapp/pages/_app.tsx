import {ChakraProvider, createStandaloneToast} from '@chakra-ui/react'
import {ToastContainer as LibToastContainer} from '@coteries/react/ui'
import useTranslation from 'next-translate/useTranslation'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import customTheme from '../styles/index'
import '../styles/styles.css'
import {AuthProvider} from '../utils/AuthContext'
import {SupabaseAuthProvider} from '../utils/SupabaseAuthContext'

function MyApp({Component, pageProps}: AppProps) {
  const {t} = useTranslation()

  const {ToastContainer} = createStandaloneToast()

  return (
    <AuthProvider>
      <SupabaseAuthProvider>
        <ChakraProvider theme={customTheme}>
          <Head>
            <link href='/favicon.ico' />
            <title>{t('common:meta_title_default')}</title>
          </Head>
          <Component {...pageProps} />
          <ToastContainer />
          <LibToastContainer />
        </ChakraProvider>
      </SupabaseAuthProvider>
    </AuthProvider>
  )
}

// noinspection JSUnusedGlobalSymbols
export default MyApp

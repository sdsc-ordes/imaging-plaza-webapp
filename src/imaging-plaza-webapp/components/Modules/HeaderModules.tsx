import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'

interface Props {
  title: string
  description?: string
  image?: string
}

const HeadModule = ({title, description, image}: Props) => {
  const {t} = useTranslation('common')

  const metaImage = image
    ? image
    : 'https://www.icolorpalette.com/download/solidcolorimage/a0add3_solid_color_background_icolorpalette.png' // placeholder

  return (
    <Head>
      <title>{t(title)}</title>
      <meta property='og:title' content={t(title)} key='og:title' />
      {description && (
        <>
          <meta name='description' content={t(description)} key='description' />
          <meta property='og:description' content={t(description)} key='og:description' />
          <meta property='twitter:description' content={t(description)} key='twitter:description' />
        </>
      )}
      <meta property='og:title' content={t(title)} key='og:description' />
      <meta property='og:image' content={metaImage} key='og:description' />
      <meta property='twitter:card' content='summary_large_image' key='twitter:card' />
      <meta property='twitter:title' content={t(title)} key='twitter:title' />
      <meta property='twitter:image' content={metaImage} key='twitter:image' />
    </Head>
  )
}
export default HeadModule

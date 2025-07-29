import {
  Button,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import {GetStaticProps} from 'next'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import PageHeader from '../../components/Common/PageHeader'
import SoftwareSection from '../../components/Common/SoftwareSection/SoftwareSection'
import MainLayout from '../../components/layouts/Mainlayout'
import HeaderModules from '../../components/Modules/HeaderModules'
import DetailsGrid from '../../components/SoftwareDetails/DetailsGrid'
import {useMemo} from 'react'
import {SchemaSoftwareSourceCode} from '../../components/Form/schema'
import BookmarkRegular from '../../components/Icons/regular/Bookmark.svg'
import BookmarkSolid from '../../components/Icons/solid/Bookmark.svg'
import {getSoftware} from '../../fetchers/sparqlFetchers.server'
import {addBookmark, removeBookmark} from '../../fetchers/userFetchers'
import {useAuth} from '../../utils/AuthContext'
import {isBookmarked} from '../../utils/softwareHelper'

const ConnectionRequiredModal = dynamic(
  () => import('../../components/AccountLogin/ConnectionRequiredModal')
)



interface Props {
  softwareData: string
}

const SoftwarePage = ({softwareData}: Props) => {
  const software = useMemo(
    () => JSON.parse(softwareData) as SchemaSoftwareSourceCode,
    [softwareData]
  )
  const {t} = useTranslation()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const relatedSoftware = [] as SchemaSoftwareSourceCode[]

  const {user} = useAuth()

  let isMarked = isBookmarked(software['schema:identifier'], user)

  const title = t('software:meta_title', {softwareName: software['schema:name']})


  const mark = async () => {
    if (user) {
      if (isMarked) {
        await removeBookmark(user, software['schema:identifier'])
      } else {
        await addBookmark(user, software['schema:identifier'])
      }
    } else {
      onOpen()
    }
  }

  return (
    <MainLayout>
      <HeaderModules
        title={title}
        description={software['schema:description'].split('.')[0] + '.'}
        image={software['schema:image'][0]['schema:contentUrl']}
      />
      <VStack w='full' spacing={8}>
        <PageHeader
          title={software['schema:name']}
          showBackButton
          rightContent={
            <Button
              variant={isMarked ? 'primary' : 'outlined'}
              onClick={mark}
              rightIcon={
                isMarked ? (
                  <BookmarkSolid height={16} width={16} />
                ) : (
                  <BookmarkRegular height={16} width={16} />
                )
              }>
              {isMarked ? t('software:bookmarked') : t('software:bookmark')}
            </Button>
          }
        />
        <DetailsGrid software={software} />

        {Array.isArray(relatedSoftware) && relatedSoftware.length > 0 && (
          <SoftwareSection
            softwareList={relatedSoftware}
            title={t('software:details_related_software')}
          />
        )}
      </VStack>

      {isOpen && <ConnectionRequiredModal isOpen={isOpen} onClose={onClose} />}
    </MainLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps: GetStaticProps<Props> = async ({params}) => {
  const id = params?.id

  if (isEmpty(id)) {
    return {
      notFound: true,
    }
  }

  //Find the software
  const softwareData = await getSoftware(id as string)
  if (!softwareData) {
    return {notFound: true}
  }
  return {
    props: {
      softwareData: JSON.stringify(softwareData),
    },
    revalidate: 900,
  }
}

export async function getStaticPaths() {
  const softwareList = [] as string[]
  const paths: any[] = []
  softwareList.forEach(item => {
    paths.push({params: {id: item}})
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

// noinspection JSUnusedGlobalSymbols
export default SoftwarePage

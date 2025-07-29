import {useTheme, VStack} from '@chakra-ui/react'
import type {ReactNode} from 'react'
import {useIsDesktop} from '../../hooks/useIsDesktop'
import PageHeader from '../Common/PageHeader'
import MainLayout from './Mainlayout'

interface Props {
  title: string
  children: ReactNode
}

const CenteredContent = ({title, children}: Props) => {
  const theme = useTheme()
  const isDesktop = useIsDesktop()

  return (
    <MainLayout>
      <PageHeader title={title} />
      <VStack
        bg={theme.colors.brand.background}
        w='full'
        borderRadius='medium'
        alignItems='start'
        p={isDesktop ? 8 : 6}
        mb={20}>
        {children}
      </VStack>
    </MainLayout>
  )
}

export default CenteredContent

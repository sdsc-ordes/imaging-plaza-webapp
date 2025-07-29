import {HStack, IconButton, Heading, Stack} from '@chakra-ui/react'
import router from 'next/router'
import type {ReactNode} from 'react'
import ArrowLeft from '../Icons/light/ArrowLeft.svg'

interface Props {
  title: string
  showBackButton?: boolean
  rightContent?: ReactNode
}

const PageHeader = ({title, showBackButton = false, rightContent}: Props) => {
  return (
    <Stack direction={['column', null, 'row']} w='full' justify='space-between' pt={6} pb={8}>
      <HStack spacing={4}>
        {showBackButton && (
          <IconButton
            onClick={() => router.back()}
            aria-label='Back'
            variant='back'
            icon={<ArrowLeft width={24} height={24} />}
          />
        )}
        <Heading as='h1' variant='h2'>
          {title}
        </Heading>
      </HStack>
      <HStack spacing={6}>{rightContent}</HStack>
    </Stack>
  )
}

export default PageHeader

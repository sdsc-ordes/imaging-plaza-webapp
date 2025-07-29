import {Text, VStack} from '@chakra-ui/react'
import Image from 'next/image'

interface Props {
  title: string
  image?: string
}

const Illustration = ({title, image}: Props) => {
  return (
    <>
      {image && (
        <VStack alignItems='flex-start' spacing={5} w='full' position='relative'>
          <Text variant='large' mb={4}>
            {title}
          </Text>
          <Image
            width={320}
            height={192}
            objectFit='cover'
            src={image}
            className='software-details-illustatrion-image'
            alt={title}
          />
        </VStack>
      )}
    </>
  )
}
export default Illustration

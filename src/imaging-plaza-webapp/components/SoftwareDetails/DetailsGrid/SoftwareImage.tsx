import { AspectRatio, Box, Button, Flex, useTheme } from '@chakra-ui/react'
// import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import styles from '../../../styles/modules/softwareCard.module.scss'
import { SchemaSoftwareSourceCode } from '../../Form/schema'

interface Props {
  software: SchemaSoftwareSourceCode
}

const SoftwareImage = ({ software }: Props) => {
  const theme = useTheme()
  // const { t } = useTranslation()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = useMemo(() => {
    return software['schema:image'] || []
  }, [software])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <AspectRatio ratio={16 / 9}>
      <Box display='flex' flexDirection='column'>
        <Box
          position='relative'
          w='full'
          h='full'
          bgColor={theme.colors.brand.background}
          display='flex'
          alignItems='center'
          justifyContent='center'
          p={4}
        >
          {images.length > 0 && (
            <>
              <Box
                position='relative'
                zIndex='1'
                w='full'
                h='full'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                <Image
                  objectFit='contain'
                  layout='fill'
                  src={images[currentImageIndex]['schema:contentUrl']}
                  className={software['schema:url'] ? styles.vSoftwarePicture : styles.SoftwarePictureRounded}
                  alt={images[currentImageIndex]['schema:keywords'] || software['schema:name']}
                />
              </Box>
              {images.length > 1 && (
                <>
                  <Button
                    position='absolute'
                    left='2'
                    top='50%'
                    transform='translateY(-50%)'
                    onClick={prevImage}
                    zIndex='2'
                    variant='ghost'
                    bg={theme.colors.brand.primary}
                    color={theme.colors.brand.white}
                    _hover={{ bg: theme.colors.brand.lightGreen }}
                    size='sm'
                  >
                    ←
                  </Button>
                  <Button
                    position='absolute'
                    right='2'
                    top='50%'
                    transform='translateY(-50%)'
                    onClick={nextImage}
                    zIndex='2'
                    variant='ghost'
                    bg={theme.colors.brand.primary}
                    color={theme.colors.brand.white}
                    _hover={{ bg: theme.colors.brand.lightGreen }}
                    size='sm'
                  >
                    →
                  </Button>

                </>
              )}
            </>
          )}
        </Box>
        
          <Flex
            w='full'
            borderBottomRadius='big'
            justifyContent='left'
            gap={3}
            flexDir={{ base: 'column', sm: 'row' }}
            bgColor={theme.colors.brand.background}
            py={4}
            px={{ base: 2, lg: 2, xl: 5 }}>

            <Flex
              position='absolute'
              bottom='4'
              left='50%'
              transform='translateX(-50%)'
              gap='2'
              zIndex='2'
              bg={theme.colors.brand.black}
              opacity={0.5}
              px={2}
              py={1}
              borderRadius='full'>
              {images.map((_, index) => (
                <Box
                  key={index}
                  w='2.5'
                  h='2.5'
                  borderRadius='full'
                  bg={index === currentImageIndex ? theme.colors.brand.white : theme.colors.brand.grey}
                  cursor='pointer'
                  onClick={() => setCurrentImageIndex(index)}
                  transition='all 0.2s'
                  _hover={{ bg: theme.colors.brand.white }}
                />
              ))}
            </Flex>
          </Flex>
        
      </Box>
    </AspectRatio>
  )
}

export default SoftwareImage

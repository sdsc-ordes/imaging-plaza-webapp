import {
  Box,
  BoxProps,
  HStack,
  Heading,
  IconButton,
  Image,
  Link,
  Text,
  VStack,
  useTheme,
} from '@chakra-ui/react'
import {motion, useMotionTemplate, useMotionValue, useSpring} from 'framer-motion'
import useTranslation from 'next-translate/useTranslation'
import {MouseEvent, useRef, useState} from 'react'
import {useIsDesktop} from '../../hooks/useIsDesktop'
import ArrowLeft from '../Icons/light/ArrowLeft.svg'
import ArrowRight from '../Icons/light/ArrowRight.svg'

interface Props {
  picture: string
  pictureAfter: string
  text: string
  link: string
}

// #CHANGE_HEADER_IMAGES
const highlighted1: Props = {
  picture: '/hero/heroImage1.webp',
  pictureAfter: '/hero/heroImage1After.webp',
  text: 'Pyxu',
  link: 'http://imagingplazadev.epfl.ch:3000/software/https%3A%2F%2Fgithub.com%2Fpyxu-org%2Fpyxu',
}

// const highlighted2: Props = {
//   picture: '/hero/heroImage2.webp',
//   pictureAfter: '/hero/heroImage2After.webp',
//   text: 'ImageMaker',
// }
const highlighted2: Props = {
  picture: '/hero/heroImage3.png',
  pictureAfter: '/hero/heroImage3After.png',
  text: 'Slic',
  link: 'http://imagingplazadev.epfl.ch:3000/software/https%3A%2F%2Fgithub.com%2Fachanta%2FSLIC',
}

const Hero = () => {
  const subContainerRef = useRef<HTMLDivElement | null>(null)
  const isDesktop = useIsDesktop()

  const [currentSoft, setCurrentSoft] = useState<Props>(highlighted1)
  const [visible, setVisible] = useState<boolean>()

  const MotionBox = motion<BoxProps>(Box)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springConfig = {damping: 25, stiffness: 300}
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  const theme = useTheme()

  const {t} = useTranslation()

  const changeBackgroundImage = () => {
    const newSoft = currentSoft === highlighted1 ? highlighted2 : highlighted1
    requestAnimationFrame(() => setCurrentSoft(newSoft))
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDesktop && subContainerRef.current) {
      const {left, top} = subContainerRef.current.getBoundingClientRect()
      const newX = e.clientX - left
      const newY = e.clientY - top
      cursorX.set(newX)
      cursorY.set(newY)
    }
  }
  const clipPath = useMotionTemplate`ellipse(128px 128px at ${cursorXSpring}px ${cursorYSpring}px)`

  const Content = () => {
    return (
      <VStack h='full' justifyContent='center' spacing={isDesktop ? 5 : 1}>
        <Heading variant='brandingHero' maxW='70%' textAlign='center' as='p' zIndex={2}>
          <Image src='/logos/imaging_plaza_white.svg' alt='logo-hero'></Image>
        </Heading>
        <Heading
          as='h1'
          variant='h1'
          color={theme.colors.brand.white}
          maxW='70%'
          textAlign='center'
          zIndex={2}>
          {t('common:hero_title_text')}
        </Heading>
        <HStack gridGap={{base: 2, md: 10}} zIndex={2}>
          <IconButton
            zIndex={100}
            onClick={changeBackgroundImage}
            aria-label='Back'
            variant='heroButton'
            color='white'
            icon={<ArrowLeft width={20} height={20} />}
          />
          <VStack>
            <Text fontSize='xs' color={theme.colors.brand.white}>
              {t('common:hero_highligh_text')}
            </Text>
            <Link href={currentSoft.link}  textDecoration="none" _hover={{ textDecoration: 'underline'}}>
            <Heading
              _hover={{cursor: 'default'}}
              textAlign='center'
              minW={{base: 0, md: 140}}
              variant='h6'
              as='h2'
              color={theme.colors.brand.white}
              textTransform='uppercase'>
              {currentSoft.text}
            </Heading>
          </Link>
          </VStack>
          <IconButton
            zIndex={100}
            onClick={changeBackgroundImage}
            aria-label='Back'
            variant='heroButton'
            icon={<ArrowRight width={20} height={20} />}
          />
        </HStack>
      </VStack>
    )
  }

  return (
    <MotionBox
      style={{width: '100%'}}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setVisible(false)}
      onMouseEnter={() => setVisible(true)}>
      <Box
        ref={subContainerRef}
        h={isDesktop ? 620 : 490}
        w='full'
        position='relative'
        overflow='hidden'
        borderRadius={{base: 'small', md: 'big'}}>
        <Box
          w='full'
          h='full'
          position='absolute'
          backgroundImage={currentSoft.picture}
          backgroundSize='cover'
          backgroundPosition='center'
        />
        {visible && isDesktop && (
          <motion.img
            style={{
              width: '100%',
              height: '100%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              objectFit: 'cover',
              clipPath,
              pointerEvents: 'none',
            }}
            src={currentSoft.pictureAfter}
            alt=''
          />
        )}
        <Content />
      </Box>
    </MotionBox>
  )
}

export default Hero

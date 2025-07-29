import {Box, HStack, Stack, Text, VStack, Link} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import React from 'react'
import ContactForm from '../components/Contact/ContactForm'
import CenteredContent from '../components/layouts/CenteredContent'
import HeadModule from '../components/Modules/HeaderModules'
import {useIsDesktop} from '../hooks/useIsDesktop'
import LocationDot from '../components/Icons/regular/LocationDot.svg'
import Phone from '../components/Icons/regular/Phone.svg'
import Envelope from '../components/Icons/regular/Envelope.svg'

const Contact = () => {
  const {t} = useTranslation()
  const isDesktop = useIsDesktop()

  return (
    <CenteredContent title={t('contact:title')}>
      <HeadModule title='contact:meta_title' description='contact:meta_description' />
      <Stack w='full' direction={{base: 'column', lg: 'row'}} p={0} m={0} mb={12}>
        <VStack spacing={5} w='full' alignItems='flex-start' justifyContent='center'>
          <Text variant='large'>{t('contact:the_imaging_plaza')}</Text>
          <VStack spacing={2} alignItems='flex-start'>
            <HStack>
              <Box w='1rem'>
                <LocationDot height={16} width={16} />
              </Box>
              <Text align='center'>{t('contact:building')}</Text>
            </HStack>
            <HStack>
              <Box w='1rem'>
                <Envelope height={16} width={16} />
              </Box>
              <Link isExternal href={`mailto:${t('contact:mail')}`}>
                {t('contact:mail')}
              </Link>
            </HStack>
            <HStack>
              <Box w='1rem'>
                <Phone height={16} width={16} />
              </Box>
              <Link isExternal href={`tel:${t('contact:tel')}`}>
                {t('contact:tel')}
              </Link>
            </HStack>
          </VStack>
        </VStack>
        <ContactForm />
      </Stack>
      <Box
        w='100%'
        maxW='fill'
        h={isDesktop ? '396px' : '200px'}
        alignItems='flex-start'
        position='relative'>
        <Image
          src='/about_image.jpeg'
          layout='fill'
          objectFit='cover'
          style={{borderRadius: '15px'}}
          alt=''
        />
      </Box>
    </CenteredContent>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Contact

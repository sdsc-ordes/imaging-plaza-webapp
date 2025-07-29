import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Spacer,
  Tag,
  Text,
  VStack,
  Button,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { ROUTES_EDIT_SOFTWARE_FORM, ROUTES_SOFTWARE_DETAILS } from '../../../constants/routes'
import { getFairLevel, isDraft } from '../../../utils/schema-utils'
import { SchemaSoftwareSourceCode } from '../../Form/schema'
import Code from '../../Icons/light/Code.svg'
import TagIcon from '../../Icons/light/Tag.svg'
import ImageLogo from '../../Icons/light/Image.svg'
// import {FairLevelBanner} from '../FairLevel/FairLevelBanner'
import FairLevelTag from '../FairLevel/FairLevelTag'
import DetailsWithIcon from './Components/DetailsWithIcon'

// PLace in stores
import { TypedFetch } from '@coteries/utils/api-utils'
import { getAuth } from 'firebase/auth'



interface Props {
  software: SchemaSoftwareSourceCode
  editable?: boolean
  showTag?: boolean
}

const HSoftwareCard = ({ software, editable, showTag = false }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [over, setOver] = useState<boolean>(false)
  const fairLevel: number = getFairLevel(software)
  const hasGPURequirements = !!software['imag:requiresGPU']
  // console.log(hasGPURequirements)

  const techDetails = software['schema:programmingLanguage']
    ? software['schema:programmingLanguage'].join(', ')
    : ''
  const featureList = software['schema:featureList']
    ? software['schema:featureList'].join(', ')
    : ''

  const HREF = editable && showTag
    ? ROUTES_EDIT_SOFTWARE_FORM(software['schema:codeRepository']![0])
    : ROUTES_SOFTWARE_DETAILS(software['schema:codeRepository']![0])


  // I added this handle for the deleting. 
  // This should not be a software string but rather a SchemaSoftwareSource

  const handleDelete = async (software: SchemaSoftwareSourceCode) => {
    try {
      const token = await getAuth().currentUser!.getIdToken();
      const data = await TypedFetch.post(
        '/api/softwares/delete',
        software as SchemaSoftwareSourceCode,
        {
          parser: SchemaSoftwareSourceCode.partial(),
          headers: {
            'X-Firebase-AppCheck': token,
          },
        }
      )

      // Handle success, if needed
      // e.g., update state, show notification
      console.info(data)
      window.location.reload();

    } catch (e) {
      // Handle error
      // e.g., show error message
      console.info(e)
    }

    // No return statement
  };

  const checkImageKeywords = (images: any[], step: string) => {

    const keywordsToCheck = step === 'before'
      ? ['animated image', 'before image', 'logo', 'illustrative image']
      : step === 'after'
        ? ['animated image', 'after image', 'logo', 'illustrative image']
        : ['animated image', 'before image', 'after image', 'logo', 'illustrative image'];

    for (let j = 0; j < keywordsToCheck.length; j++) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (image['schema:keywords'] && image['schema:keywords'] === keywordsToCheck[j]) {
          // console.log(step + " " + i + " " + image['schema:keywords'])
          return i;
        }
      }
    }
    return 0;
  };
  //console.log(software['schema:image'])
  return (
    <Box
      h='full'
      w='full'
      onClick={(e) => {
        // Don't navigate if clicking on buttons
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        router.push(HREF);
      }}
      cursor='pointer'
    >
      <Flex
        alignItems='start'
        onMouseOver={() => setOver(true)}
        onMouseOut={() => setOver(false)}>
        <Container position='relative' h='full' maxH={56} w='fit-content' p={0}>
          {fairLevel === 5 ? (
            <Box position='absolute' top={1} left={1} zIndex={2}>
              <FairLevelTag level={fairLevel} />
            </Box>
          ) : (
            <Box position='absolute' top={1} left={1} zIndex={2}>
              <FairLevelTag level={fairLevel} />
            </Box>
          )}
          <Box position='relative' h='220px' w='320px'>
            {software['schema:image']!.length > 0 && (
              <Box position='relative' zIndex='1' top='0' left='0' h='220px' w='320px'>
                <Image
                  objectFit='cover'
                  objectPosition='top left'
                  src={software['schema:image']![checkImageKeywords(software['schema:image'], "before")]['schema:contentUrl']}
                  fill
                  alt={software['schema:name']!}
                  style={{
                    opacity: `${over ? (software['schema:image']!.length > 1 ? '0' : '1') : '1'
                      }`,
                    transition: '0s',
                  }}
                />
              </Box>
            )}
            {software['schema:image']!.length > 1 && (
              <Box position='absolute' zIndex='0' top='0' left='0' h='220px' w='320px'>
                <Image
                  objectFit='cover'
                  objectPosition='top left'
                  src={software['schema:image']![checkImageKeywords(software['schema:image'], "after")]['schema:contentUrl']}
                  fill
                  alt={software['schema:name']!}
                  style={{
                    position: 'absolute',
                    zIndex: '1',
                    opacity: `${over ? (software['schema:image']!.length > 1 ? '1' : '0') : '0'
                      }`,
                    transition: '0s',
                  }}
                />
              </Box>
            )}
          </Box>
        </Container>
        <VStack
          h='full'
          minH={56}
          p={5}
          borderLeft='1px'
          borderLeftColor='brand.superLightGreen'
          flex={1}
          alignItems='start'
          overflow='hidden'
          bg='brand.white'
          borderRightRadius='big'>
          <VStack h='full' w='full' flex={1} alignItems='start'>
            <HStack w='full' justifyContent='space-between' mb={3}>
              <Heading as='h3' variant='h6'>
                {software['schema:name']}
              </Heading>
              <HStack spacing={3}>
                {hasGPURequirements && <Text variant='tag'>{t('software:gpu_label')}</Text>}
              </HStack>
            </HStack>
            {software['imag:imagingModality'] && (
              <DetailsWithIcon
                icon={<ImageLogo height={16} width={16} />}
                text={software['imag:imagingModality'][0]}
              />
            )}
            {featureList && (
              <DetailsWithIcon icon={<TagIcon height={14} width={14} />} text={featureList} />
            )}
            {techDetails && (
              <DetailsWithIcon icon={<Code height={14} width={14} />} text={techDetails} />
            )}
            {editable && showTag && (
              <>
                <Spacer />
                <HStack w='full'>
                  <Spacer />
                  <Tag colorScheme={isDraft(software) ? 'orange' : 'green'}>
                    {isDraft(software) ? 'Draft' : 'Validated'}
                  </Tag>
                  <Button
                    isDisabled={false}
                    type='button'
                    colorScheme='teal'
                    bg='brand.primary'
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      router.push(HREF);
                    }}
                  >
                    {t('Edit')}
                  </Button>
                  <Button
                    isDisabled={false}
                    type='button'
                    colorScheme='teal'
                    bg='brand.primary'
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleDelete(software);
                    }}
                  >
                    {t('Delete')}
                  </Button>
                </HStack>
              </>
            )}
          </VStack>
        </VStack>
      </Flex>
    </Box>
  )
}

export default HSoftwareCard

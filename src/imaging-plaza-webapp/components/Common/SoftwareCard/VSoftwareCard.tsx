import {
  Box,
  Container,
  Heading,
  HStack,
  Spacer,
  Tag,
  Text,
  useTheme,
  VStack,
  Button,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { useState } from 'react'
import { ROUTES_EDIT_SOFTWARE_FORM, ROUTES_SOFTWARE_DETAILS } from '../../../constants/routes'
import styles from '../../../styles/modules/softwareCard.module.scss'
import { getFairLevel, isDraft } from '../../../utils/schema-utils'
import { SchemaSoftwareSourceCode } from '../../Form/schema'
import Code from '../../Icons/light/Code.svg'
import ImageLogo from '../../Icons/light/Image.svg'
// import {FairLevelBanner} from '../FairLevel/FairLevelBanner'
import FairLevelTag from '../FairLevel/FairLevelTag'
import DetailsWithIcon from './Components/DetailsWithIcon'
import { useRouter } from 'next/router'

// PLace in stores
import { TypedFetch } from '@coteries/utils/api-utils'
import { getAuth } from 'firebase/auth'

interface Props {
  software: SchemaSoftwareSourceCode
  editable?: boolean
  showTag?: boolean
}

const VSoftwareCard = ({ software, editable, showTag = false }: Props) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const router = useRouter()

  const [over, setOver] = useState<boolean>(false)

  const fairLevel: number = getFairLevel(software)

  const hasGPURequirements = !!software['imag:requiresGPU']

  const techDetails = software['schema:programmingLanguage']
    ? software['schema:programmingLanguage'].join(', ')
    : ''

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

  const HREF = editable
    ? ROUTES_EDIT_SOFTWARE_FORM(software['schema:codeRepository']![0])
    : ROUTES_SOFTWARE_DETAILS(software['schema:codeRepository']![0])

  return (
    <Box 
      h='full'
      onClick={(e) => {
        // Don't navigate if clicking on buttons
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        router.push(HREF);
      }}
      cursor='pointer'
    >
      <VStack
        h='full'
        maxW={{ base: 'full', md: '354px' }}
        bg={theme.colors.brand.white}
        borderRadius='medium'
        position='relative'
        spacing={0}
        minH='436px'
        onMouseOver={() => setOver(true)}
        onMouseOut={() => setOver(false)}
        overflow='hidden'>
        <Container position='relative' w='full' h='fit-content' p={0} borderLeftRadius='medium'>
          {fairLevel === 5 ? (
            <Box position='absolute' top={5} left={5} zIndex={2}>
              <FairLevelTag level={fairLevel} />
            </Box>
          ) : (
            <Box position='absolute' top={5} left={5} zIndex={2}>
              <FairLevelTag level={fairLevel} />
            </Box>
          )}

          <Box position='relative'>
            {software['schema:image']!.length > 0 && (
              <Box position='relative' zIndex='1' h='256px'>
                {software['schema:image']!.length > 0 && (
                  <Box position='absolute' zIndex='1' top='0' left='0' h='256px' w='full'>
                    <Image
                      objectFit='contain'
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
                  <Box position='absolute' zIndex='0' top='0' left='0' h='256px' w='full'>
                    <Image
                      objectFit='contain'
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
            )}
            {software['schema:image']!.length > 1 && (
              <Box position='absolute' zIndex='0' top='0' left='0' maxH={56} overflow='hidden'>
                <Image
                  objectFit='cover'
                  src={software['schema:image']![1]['schema:contentUrl']}
                  height={319}
                  width={398}
                  className={styles.vSoftwarePicture}
                  alt={software['schema:name']!}
                  style={{
                    position: 'absolute',
                    zIndex: '1',
                  }}
                />
              </Box>
            )}
          </Box>
        </Container>
        <VStack
          h='full'
          w='full'
          flex={1}
          p={5}
          alignItems='start'
          borderTop='1px'
          borderTopColor='brand.superLightGreen'>
          <HStack w='full' justifyContent='space-between' mb={2}>
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
    </Box>
  )
}

export default VSoftwareCard

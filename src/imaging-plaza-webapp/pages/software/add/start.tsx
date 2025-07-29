import {ROUTES_ADD_SOFTWARE_OVERVIEW} from '@/constants/routes'
import {GimiePayload} from '@/models/GimiePayload'
import {useFormStore} from '@/stores/formStore'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  Text,
  useBoolean,
  useTheme,
  VStack,
} from '@chakra-ui/react'
import {toast} from '@coteries/react/ui'
import {FetchError} from '@coteries/utils/api-utils'
import {zodResolver} from '@hookform/resolvers/zod'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import PageHeader from '../../../components/Common/PageHeader'
import ArrowRight from '../../../components/Icons/light/ArrowRight.svg'
import MainLayout from '../../../components/layouts/Mainlayout'
import HeadModule from '../../../components/Modules/HeaderModules'
import {Role} from '../../../models/User'

const GIMIE_REPO = 'https://github.com/SDSC-ORD/gimie'

const Start = () => {
  const {t} = useTranslation('start')
  const theme = useTheme()
  const {
    register,
    handleSubmit,
    formState: {isValid, errors},
    setError,
    watch,
  } = useForm<GimiePayload>({resolver: zodResolver(GimiePayload)})
  const [isLoading, setLoading] = useBoolean()
  const router = useRouter()
  const [startAnyway, setStartAnyway] = useBoolean()
  const {loadFromGimie, loadWithoutGimie} = useFormStore()
  // console.log("start.tsx | Start")

  return (
    <MainLayout restrictedType={[Role.ADMIN, Role.USER]}>
      <HeadModule title='form:meta_title_add' description='form:meta_description' />
      <PageHeader title={t('start:title_start')} showBackButton />
      <HStack justifyContent='center' w='full' mb={20}>
        <VStack
          w={{base: 'full', md: 'initial'}}
          maxW='450px'
          borderRadius='big'
          bg={theme.colors.brand.background}
          p={8}
          spacing={8}>
          <Heading variant='h5'>{t('start:title_info')}</Heading>
          <VStack align='left'>
            <Text>{t('start:text_info_1')}</Text>
            <Text>{t('start:text_info_2')}</Text>
          </VStack>

          <form
            style={{width: '100%'}}
            onSubmit={handleSubmit(async d => {
              try {
                setLoading.on()
                await loadFromGimie(d.repository)
                router.push(ROUTES_ADD_SOFTWARE_OVERVIEW)
              } catch (e) {
                // console.log("start.tsx | loadFromGimie error :", e)
                const err = t(
                  e instanceof FetchError && e.status === 400
                    ? 'gimie.existing-repo'
                    : 'gimie.failure'
                )
                if (e instanceof FetchError && e.status !== 400) {
                  setStartAnyway.on()
                }

                toast.error(err)
                setError('repository', {message: err})
              } finally {
                setLoading.off()
              }
            })}>
            <VStack align='stretch'>
              <FormControl isInvalid={!!errors.repository}>
                <FormLabel>{t('gimie.repository')}</FormLabel>
                <Input {...register('repository')} placeholder={t('gimie.placeholder')} />
                {errors.repository ? (
                  <FormErrorMessage>{errors.repository.message}</FormErrorMessage>
                ) : (
                  <FormHelperText>
                    <Trans
                      i18nKey='start:gimie.description'
                      components={{
                        link: (
                          <Link
                            href={GIMIE_REPO}
                            target='_blank'
                            style={{textDecoration: 'underline'}}
                          />
                        ),
                      }}
                    />
                  </FormHelperText>
                )}
              </FormControl>
              <HStack mt={5}>
                <Spacer />
                {startAnyway && (
                  <Button
                    px={50}
                    isLoading={isLoading}
                    borderRadius='full'
                    colorScheme='red'
                    onClick={() => {
                      loadWithoutGimie(watch('repository'))
                      router.push(ROUTES_ADD_SOFTWARE_OVERVIEW)
                    }}
                    rightIcon={<ArrowRight width={18} height='auto' />}>
                    {t('start_anyway_button')}
                  </Button>
                )}
                {/* #INSERT_PREFILL_3: duplicate */}
                <Button
                  px={50}
                  isDisabled={!isValid}
                  isLoading={isLoading}
                  variant='primary'
                  type='submit'
                  rightIcon={<ArrowRight width={18} height='auto' />}>
                  {t('start_button')}
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </HStack>
    </MainLayout>
  )
}

export default Start

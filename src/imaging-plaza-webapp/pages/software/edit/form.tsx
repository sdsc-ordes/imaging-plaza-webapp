import {Button, Flex, Spinner, Stack, Text, useTheme, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import PageHeader from '../../../components/Common/PageHeader'
import FairLevel from '../../../components/Form/FairLevel'
import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {schemaDescriptor} from '../../../components/Form/schema-ui'
import TriangeExclamation from '../../../components/Icons/regular/TriangleExclamation.svg'
import MainLayout from '../../../components/layouts/Mainlayout'
import HeadModule from '../../../components/Modules/HeaderModules'
import SchemaForm from '../../../components/ReForm/SchemaForm'
import TabsMenu from '../../../components/SoftwareDetails/TabsMenu'
import {ROUTES_HOME} from '../../../constants/routes'
import {Role} from '../../../models/User'
import {useFormStore} from '../../../stores/formStore'
import {useAuth} from '../../../utils/AuthContext'

import {Suspense} from 'react';

export enum FormSteps {
  GENERAL = 'general',
  OVERVIEW = 'overview',
  INPUT_OUTPUT = 'inputOutput',
  TECHNICAL_DETAILS = 'technicalDetails',
  IMPACT = 'impact',
  FAIR_LEVEL = 'fairLevel',
  CONTACT = 'contact',
}

const Form = () => {
  const theme = useTheme()
  const {t} = useTranslation()
  const router = useRouter()
  const [error, setError] = useState<boolean>(false)
  const {load, data: software} = useFormStore()
  const {user} = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  const step = router.query.step?.toString()

  // Loading the software data client-side to avoid hydration error
  useEffect(() => {
    if (!router.query.id) {
      setIsLoading(false)
      return
    }

    const getSoft = async () => {
      try {
        if (user) {
          await load(router.query.id as string)
          setError(false)
        }
      } catch (e) {
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    getSoft()
  }, [router, user, load])

  // Adding logic to knwow when the form has been saved or is dirty. 

  const [isSaved, setIsSaved] = useState(false);
  const handleSave = (value: boolean) => {
      setIsSaved(value);
  }
  const [isDirty, setIsDirty] = useState(false);
  const handleDirty = (value: boolean) => {
      setIsDirty(value);
  }

  const [modalWarning, setModalWarning] = useState(false);

  useEffect(() => {
    if (!isSaved && isDirty) {
      setModalWarning?.(true);
    } else {
      setModalWarning?.(false);
    }
  }, [isSaved, isDirty]);
  
  if (isLoading) {
    return (
      <MainLayout restrictedType={[Role.ADMIN, Role.USER]}>
        <Flex
          w='full'
          minH='10rem'
          p={5}
          borderRadius={theme.radii.big}
          alignItems='center'
          justifyContent='center'>
          <Spinner size='md' color={theme.colors.brand.greyLight} />
        </Flex>
      </MainLayout>
    )
  }

  return ( 
    <MainLayout restrictedType={[Role.ADMIN, Role.USER]}>
      <HeadModule title='form:meta_title_edit' description='form:meta_description' />
      <Suspense fallback={<Spinner size='md' color={theme.colors.brand.greyLight} />}>
        <PageHeader title={software?.['schema:name'] ?? ''} showBackButton />
      </Suspense>
      <Stack direction={{base: 'column', lg: 'row'}} w='full' align='stretch' spacing={8} mb={20}>
        <TabsMenu modalWarning={modalWarning}/>
        <VStack
          h='full'
          m={0}
          p={0}
          align='stretch'
          flexGrow='1'
          w={{base: 'full', md: 'calc(100% - 350px)'}}>
          {software ? (
            <>
              {step === 'fairLevel' ? (
                <FairLevel software={software! as SchemaSoftwareSourceCode} />
              ) : (
                <SchemaForm
                  schema={schemaDescriptor}
                  currentDescriptor={step || ''}
                  fields={SchemaSoftwareSourceCode}
                  onSave={handleSave}
                  onDirty={handleDirty}
                />
              )}
            </>
          ) : error ? (
            <Flex direction='column' gap={3} placeItems='center'>
              <TriangeExclamation width={48} height={48} color={theme.colors.brand.red} />
              <Text fontWeight='bold' color={theme.colors.brand.red}>
                {t('form:no_software_found')}
              </Text>
              <Link href={ROUTES_HOME} passHref>
                {/* Removing as='a' to avoid hydration error */}
                <Button variant='primary'>
                  {t('common:error_page_button')}
                </Button>
              </Link>
            </Flex>
          ) : null}
        </VStack>
      </Stack>
    </MainLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Form

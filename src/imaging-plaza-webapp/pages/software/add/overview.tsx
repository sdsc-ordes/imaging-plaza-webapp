import {Flex, HStack, useDisclosure, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useEffect, useState} from 'react'
import PageHeader from '../../../components/Common/PageHeader'
import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {schemaDescriptor} from '../../../components/Form/schema-ui'
import ValidateModal from '../../../components/Form/ValidateModal'
import MainLayout from '../../../components/layouts/Mainlayout'
import HeadModule from '../../../components/Modules/HeaderModules'
import SchemaForm from '../../../components/ReForm/SchemaForm'
import {Role} from '../../../models/User'
import {useFormStore} from '../../../stores/formStore'
import {useRouter} from 'next/router'

const Overview = () => {
  const {t} = useTranslation()
  const validateModal = useDisclosure()
  const [softwareId] = useState('')
  const {load} = useFormStore()
  const router = useRouter()

  useEffect(() => {
    load()
  }, [load])

  return (
    <MainLayout restrictedType={[Role.ADMIN, Role.USER]}>
      <HeadModule title='form:meta_title_add' description='form:meta_description' />
      <PageHeader title={t('overview:title')} showBackButton />
      <Flex w='full' px={{base: 0, md: '100px'}}>
        <VStack w='full'>
          <SchemaForm
            schema={schemaDescriptor}
            fields={SchemaSoftwareSourceCode}
            currentDescriptor='general'
            onSave={() => router.replace('/account?step=softwareAdded')}
          />
        </VStack>
      </Flex>
      <HStack w='full' p={8} justifyContent='end'>
        {validateModal.isOpen && (
          <ValidateModal
            isOpen={validateModal.isOpen}
            onClose={validateModal.onClose}
            softwareId={softwareId}
          />
        )}
      </HStack>
    </MainLayout>
  )
}

export default Overview

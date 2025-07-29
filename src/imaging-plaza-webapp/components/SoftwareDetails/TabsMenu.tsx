import {getFairLevel} from '@/utils/schema-utils'
import {Button, Divider, Text, Tooltip, useBoolean, useTheme, VStack} from '@chakra-ui/react'
import {toast} from '@coteries/react/ui'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {ROUTES_CONTACT} from '../../constants/routes'
import {FormSteps} from '../../pages/software/edit/form'
import {useFormStore} from '../../stores/formStore'
import {SchemaSoftwareSourceCode} from '../Form/schema'
import {schemaDescriptor} from '../Form/schema-ui'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import React, {useState} from 'react'

interface TabsMenuProps {
  modalWarning: boolean;
}


export const TabsMenu = ({ modalWarning }: TabsMenuProps) => {
  const theme = useTheme()
  const {t} = useTranslation()
  const {validateSoftware, isSoftwareValidatable, isDirty, data: software} = useFormStore()
  const [isValidating, setValidating] = useBoolean()

  const router = useRouter()

  const steps = Object.keys(schemaDescriptor.descriptors)
  const step = router.query.step?.toString()

  const fairLevel = getFairLevel(software as SchemaSoftwareSourceCode)

  const { isOpen, onOpen, onClose } = useDisclosure()
  // const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)


  return (
    <VStack w={{base: 'full', md: 'fit-content'}} px={{base: 8, md: '0'}} alignItems='start'>
      <VStack
        w='full'
        alignItems='start'
        p={8}
        borderRadius='big'
        bg={theme.colors.brand.background}>
        <VStack alignItems='start' gap={2}>
  {steps.map((item, index) => {
    // console.log('item:', item)
    return (
      <React.Fragment key={index}>
        <Link
          key={item}
          passHref
          replace
          href={{ pathname: router.pathname, query: { ...router.query, step: item } }}>
          <Button
            // as='a'
            variant='link'
            isActive={item === step}
            _last={{ mb: 3 }}
            onClick={(e) => {
              e.preventDefault()
              setSelectedItem(item)
              if ( modalWarning) {
                onOpen();
              } else {
                router.push({
                  pathname: router.pathname,
                  query: { ...router.query, step: item },
                });
              }
            }}>
            {t(`form:${item}_button`)}
          </Button>
        </Link>

        

        {selectedItem === item && (
          <Modal isOpen={isOpen} onClose={() => {
            setSelectedItem(null)
            onClose()
          }}>
            <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
            <ModalContent>
              <ModalHeader>{t(`form:${item}_button`)}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p>You are about to switch to a new tab, please make sure you saved your work or stay on this page</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme='blue'
                  mr={3}
                  onClick={() => {
                    setSelectedItem(null)
                    onClose()
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, step: item },
                    })
                  }}>
                  I'm sure I've saved my work
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => {
                    setSelectedItem(null)
                    onClose()
                  }}>
                  Stay on page
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </React.Fragment>
    )
  })}
  </VStack>

        <Divider />
        <Link
          key="fairLevel"
          passHref
          href={{
            pathname: router.pathname,
            query: {...router.query, step: FormSteps.FAIR_LEVEL},
          }}>
          {/* Removing as='a' from below to avoid hydration errors */}
          <Button variant='link' isActive={FormSteps.FAIR_LEVEL === step} py={2} >
            {t('form:fairLvl_button')}
          </Button>
        </Link>
        <Tooltip
          isDisabled={fairLevel > 0}
          hasArrow
          shouldWrapChildren={fairLevel === 0}
          label='Your fair level is 0, you cannot publish your software'>
          <Button
            variant='outlined'
            py={2}
            isLoading={isValidating}
            isDisabled={!isSoftwareValidatable || isDirty || fairLevel === 0}
            onClick={async () => {
              try {
                setValidating.on()
                await validateSoftware()
                toast.success(t('schema:published'))
              } catch (e) {
              } finally {
                setValidating.off()
              }
            }}>
            {t('schema:publish')}
          </Button>
        </Tooltip>
        {/* #INSERT_SOFTWARE_ACTION_1: add button */}
      </VStack>
      <VStack w='full' px={7} spacing={0} alignItems='start' pt={8}>
        <Text size='small'>{t('form:question')}</Text>
        <Link href={ROUTES_CONTACT} passHref>
          {/* Removing as='a' to avoid hydration problem below */}
          <Text variant='link' color={theme.colors.brand.primary}>
            {t('form:contact')}
          </Text>
        </Link>
      </VStack>
    </VStack>
  )
}
export default TabsMenu


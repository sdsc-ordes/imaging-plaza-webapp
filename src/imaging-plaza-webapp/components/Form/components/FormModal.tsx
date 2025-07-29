import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useTheme,
} from '@chakra-ui/react'
import {type ReactNode} from 'react'
import Plus from '../../Icons/solid/Plus.svg'

interface Props {
  buttonName: string
  modalTitle: string
  setVisible: (val: boolean) => void
  visible: boolean
  children: ReactNode
}

const FormModal = ({children, visible, setVisible, buttonName, modalTitle}: Props) => {
  const theme = useTheme()

  const handleOpenButtonClick = () => {
    setVisible(true)
  }

  return (
    <>
      <Button
        variant='outlined'
        type='button'
        onClick={handleOpenButtonClick}
        leftIcon={<Plus color={theme.colors.brand.primary} height={14} width={14} />}>
        {buttonName}
      </Button>

      <Modal
        isOpen={visible}
        onClose={() => setVisible(false)}
        size='2xl'
        closeOnEsc={false}
        closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent p={4} backgroundColor={theme.colors.brand.background} borderRadius='big'>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default FormModal

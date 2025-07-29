import {Modal, ModalContent, ModalOverlay, useTheme} from '@chakra-ui/react'
import type {ReactNode} from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const ModalContainer = ({isOpen, onClose, children}: Props) => {
  const theme = useTheme()

  return (
    <Modal scrollBehavior='inside' isOpen={isOpen} isCentered size='lg' onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius='medium' p={4} bg={theme.colors.brand.background}>
        {children}
      </ModalContent>
    </Modal>
  )
}

export default ModalContainer

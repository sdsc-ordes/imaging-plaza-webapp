import {Button, Flex, ModalFooter} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  hideModal: () => void
  onSave?: () => void
}

const FormModalFooter = ({hideModal}: Props) => {
  const {t} = useTranslation()

  return (
    <ModalFooter px={0}>
      <Flex gap={4}>
        <Button variant='outlined' onClick={hideModal}>
          {t('common:cancel')}
        </Button>
        <Button variant='primary' type='submit'>
          {t('common:save')}
        </Button>
      </Flex>
    </ModalFooter>
  )
}

export default FormModalFooter

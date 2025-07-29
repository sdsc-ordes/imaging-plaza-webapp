import {Button, Flex} from '@chakra-ui/react'
import Save from '../../Icons/solid/Save.svg'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  loading: boolean
}

const SubmitButtons = ({loading}: Props) => {
  const {t} = useTranslation()

  return (
    <Flex
      alignItems='center'
      gap={5}
      justifyContent='end'
      direction={['column', null, 'row']}
      mt={5}>
      <Button
        variant='primary'
        type='submit'
        isLoading={loading}
        leftIcon={<Save height={16} width={16} />}
        w={['full', null, 'auto']}>
        {t('common:save')}
      </Button>
    </Flex>
  )
}
export default SubmitButtons

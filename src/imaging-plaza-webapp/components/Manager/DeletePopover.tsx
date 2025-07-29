import {
  Box,
  Button,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger as OrigPopoverTrigger,
  Text,
  useTheme,
  VStack,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useState} from 'react'
import {deleteSoftware} from '../../fetchers/softwareFetchers'
import Trash from '../Icons/light/Trash.svg'

export const PopoverTrigger: React.FC<{children: React.ReactNode}> = OrigPopoverTrigger

interface Props {
  name: string
  softwareID: string
}

const DeletePopover = ({name, softwareID}: Props) => {
  const {t} = useTranslation('manager')
  const theme = useTheme()
  const [loading, setLoading] = useState(false)

  const deleteConfirmation = async () => {
    setLoading(true)
    await deleteSoftware(softwareID)
    setLoading(false)
    const showToast = await import('../../utils/showToast').then(mod => mod.showToast)
    showToast(t('manager:status_delete_success', {name: name}), 'success')
  }

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          variant='link'
          icon={<Trash width={20} height={20} color={theme.colors.brand.grey} />}
          aria-label='delete'
        />
      </PopoverTrigger>
      <PopoverContent p={4} shadow='xs' _focus={{boxShadow: 'xs'}}>
        <PopoverArrow />
        <VStack spacing='24px' textAlign='start'>
          <PopoverCloseButton />
          <Heading w='full' size='md'>
            {t('manager:popover_delete_title')}
          </Heading>
          <Text>{t('manager:popover_delete_message', {name: name})}</Text>
          <Box textAlign='end' w='full'>
            <Button
              backgroundColor={theme.colors.brand.red}
              _hover={theme.colors.brand.red}
              isLoading={loading}
              onClick={deleteConfirmation}>
              {t('manager:delete_button')}
            </Button>
          </Box>
        </VStack>
      </PopoverContent>
    </Popover>
  )
}
export default DeletePopover

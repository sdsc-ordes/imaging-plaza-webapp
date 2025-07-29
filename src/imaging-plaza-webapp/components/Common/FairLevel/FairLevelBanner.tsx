import {Box, HStack, Text, useTheme} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  isVertical?: boolean
}
export const FairLevelBanner = ({isVertical = false}: Props) => {
  const theme = useTheme()
  const {t} = useTranslation()

  return (
    <HStack
      w='full'
      h='2rem'
      bgColor={theme.colors.brand.primary}
      borderTopLeftRadius='medium'
      borderTopRightRadius={isVertical ? 'medium' : 'none'}
      justifyContent='center'>
      <Text variant='large' fontWeight='regular' color={theme.colors.brand.white}>
        {t('software:details_fair_level')}
      </Text>
      <Box
        w='2.5rem'
        h='2.5rem'
        borderWidth='0.25rem'
        margin='auto'
        borderColor={theme.colors.brand.white}
        borderRadius='full'
        display='flex'
        alignItems='center'>
        <Text color={theme.colors.brand.white} variant='large' w='full' textAlign='center'>
          5
        </Text>
      </Box>
    </HStack>
  )
}

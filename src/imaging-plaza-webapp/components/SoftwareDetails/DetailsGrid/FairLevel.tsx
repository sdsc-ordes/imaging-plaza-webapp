import {Box, Button, Text, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import Link from 'next/link'
import {ROUTES_FAQ} from '../../../constants/routes'
import {getFairLevel} from '../../../utils/schema-utils'
import {SchemaSoftwareSourceCode} from '../../Form/schema'
import ArrowRight from '../../Icons/solid/ArrowRight.svg'

interface FairLevelProps {
  software: SchemaSoftwareSourceCode
}

const FairLevel = ({software}: FairLevelProps) => {
  const {t} = useTranslation()
  // const theme = useTheme()

  const fairLevel = getFairLevel(software)
  if (fairLevel === 0) return null

  return (
    <VStack spacing={4} align='center' w='full'>
      <Box>
        <Image
          src={`/logos/FAIR_level_${fairLevel}.svg`}
          height={120}
          width={120}
          alt='fair level'
        />
      </Box>
      <Text textAlign="center" fontSize={16}>
        {t('software:fair_level_text', { level: fairLevel })}
      </Text>
      <Link href={ROUTES_FAQ} passHref>
        <Button variant='outlined' rightIcon={<ArrowRight width='12px' height='12px' />}>
          {t('common:fair_level_button')}
        </Button>
      </Link>
    </VStack>
  )
}

export default FairLevel

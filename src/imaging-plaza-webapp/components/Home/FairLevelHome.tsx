import { Button, Flex, Heading, Text, useTheme } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { ROUTES_FAQ_FAIR } from '../../constants/routes'
import Image from 'next/image'
import ArrowRight from '../Icons/solid/ArrowRight.svg'

const FairLevelHome = () => {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Flex
      w="full"
      justify="center"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 8 }}
    >
      <Flex
        w={{base: '90%', md: '700px', lg: '947px'}}
        direction="column"
        align="center"
        bg={theme.colors.brand.superLightGreen}
        borderRadius="big"
        py={12}
        px={6}
        gap={6}
      >
        <Heading
          color={theme.colors.brand.primary}
          textAlign="center"
          fontWeight="bold"
        >
          {t('common:fair_level_title')}
        </Heading>

        <Text
          variant="large"
          align="center"
          maxW="600px"
        >
          {t('common:fair_level_subtitle')}
        </Text>

        <Image
          src="/logos/FAIR_level_1_to_5.svg"
          height={128}
          width={128}
          alt="Fair Level"
        />

        <Link href={ROUTES_FAQ_FAIR} passHref>
          <Button
            variant='searchBig'
            rightIcon={<ArrowRight color={theme.colors.brand.white} height='12px' width='12px' />}>
            {t('common:fair_level_button')}
          </Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export default FairLevelHome
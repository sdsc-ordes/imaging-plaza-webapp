import { Link, Box, Text, VStack, HStack, Icon, Button } from '@chakra-ui/react'
import { validate } from '@coteries/utils'
import { Schemas } from '../../../../utils/schema-utils'
import { SoftwareImage } from '../../../Form/schema'
import CodeFork from '../../../Icons/solid/CodeFork.svg'
import ExternalLink from '../../../Icons/regular/ExternalLink.svg'
import useTranslation from 'next-translate/useTranslation'
import VariableItem from '../Components/VariableItem'
const isImage = validate<SoftwareImage>(obj => obj['@type'] === Schemas.SoftwareImage)

const RowImage = ({ image }: { image: SoftwareImage }) => {
  const { t } = useTranslation()

  return (
    <Link
      href={image['sd:availableInRegistry']}
      isExternal
      display="block"
      w="100%"
      _hover={{ textDecoration: 'none' }}
    >
      <Box
        py={4}
        px={2}
        borderWidth="1px"
        borderRadius="md"
        backgroundColor="brand.white"
        transition="all 0.2s"
        h="full"
        _hover={{
          boxShadow: 'md',
        }}
      >
        <VStack spacing={6} align="start" h="full" justify="space-between">
          <VStack spacing={3} align="start">
            <Text variant='semiBold' noOfLines={1}>{image['schema:name']}</Text>

            {image['schema:softwareVersion'] && (
              <VariableItem
                text={image['schema:softwareVersion']}
                label={t('schema:softwareVersion_label')}
                icon={CodeFork}
              />
            )}
          </VStack>
          {image['sd:availableInRegistry'] && (
            <HStack spacing={1}>
              <Button variant='link' color="brand.primary">
                {t('software:details_see_software_image')}
            </Button>
              <Icon as={ExternalLink} color="brand.primary" boxSize={3} />
            </HStack>
          )}
        </VStack>
      </Box>
    </Link>
  )
}
export const ImageRow = ({ image }: { image: SoftwareImage }) => {
  if (isImage(image)) return <RowImage image={image} />
  else return null
}

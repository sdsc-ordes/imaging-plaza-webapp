import { HStack, Text, Box, Link, Icon } from "@chakra-ui/react"
import ExternalLink from '../../../Icons/regular/ExternalLink.svg'

interface LinkItemProps {
    title: string   
    link?: string
    linkText?: string
}

const LinkItem = ({title, link, linkText}: LinkItemProps) => {
    
    return (
      <>
        {link && (
        <Box alignItems='flex-start'>
        <HStack spacing={4} align="center">
          <Text variant='semiBold'> 
            {title}
          </Text>
            <Link href={link} isExternal>
              <HStack spacing={1}>
                <Text variant='link'>
                  {linkText}
                </Text>
                <Icon as={ExternalLink} color="brand.primary" boxSize={3} />
              </HStack>
            </Link>
        </HStack>
        </Box>
        )}
      </>
    )
  } 

export default LinkItem
import { Box, Button, HStack, Menu as ChakraMenu, MenuButton, MenuList, MenuItem, } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ChevronDown from '../../Icons/regular/ChevronDown.svg'
import {
  EXTERNAL_ROUTE_ONTOLOGY,
  ROUTES_ABOUT,
  ROUTES_CONTACT,
  ROUTES_FAQ,
  ROUTES_HOME,
  ROUTES_SEARCH,
} from '../../../constants/routes'

interface Props {
  link: string
  name: string
}

const RenderItem = ({ link, name }: Props) => {
  const router = useRouter()

  return (
    <Button
      as={Link}
      href={link}
      variant='navLink'
      isActive={router.route === link}
    >
      {name}
    </Button>
  )
}


// #CHANGE_SECTIONS
const menuEntries = [
  { link: ROUTES_HOME, name: 'common:home' },
  { link: ROUTES_SEARCH(), name: 'common:search' },
  { link: ROUTES_ABOUT, name: 'common:about' },
]

const menuGroup = [
  { link: ROUTES_CONTACT, name: 'common:contact' },
  { link: ROUTES_FAQ, name: 'common:faq' },
  { link: EXTERNAL_ROUTE_ONTOLOGY, name: 'common:ontology' }
]

const Menu = () => {
  const { t } = useTranslation()

  return (
    <Box flexGrow={1} zIndex={110}>
      <HStack h='full' justifyContent='center'>
        {menuEntries.map(entry => (
          <RenderItem link={entry.link} name={t(entry.name)} key={entry.link} />
        ))}
        <ChakraMenu>
          <MenuButton variant='navLink' as={Button} rightIcon={<ChevronDown height={16} width={16} />}>
            More
          </MenuButton>
          <MenuList
            px={2}
            py={2}
            borderRadius='medium'
            >
            {menuGroup.map(entry => (
              <MenuItem key={entry.link} >
                <RenderItem link={entry.link} name={t(entry.name)} key={entry.link} />
              </MenuItem>
            ))}
          </MenuList>

        </ChakraMenu>

      </HStack>
    </Box>
  )
}

export default Menu

import {extendTheme} from '@chakra-ui/react'
import Button from './components/Button'
import Checkbox from './components/Checkbox'
import Input from './components/Input'
import Link from './components/Link'
import Menu from './components/Menu'
import Radio from './components/Radio'
import Select from './components/Select'
import Switch from './components/Switch'
import Table from './components/Table'
import Tabs from './components/Tabs'
import Textarea from './components/Textarea'

import breakpoints from './foundations/breakpoints'
import colors from './foundations/colors'
import fonts from './foundations/fonts'
import fontSizes from './foundations/fontSizes'
import fontWeights from './foundations/fontWeights'
import radii from './foundations/radii'
import shadows from './foundations/shadows'
import sizes from './foundations/sizes'
import styles from './foundations/styles'

import Heading from './typography/heading'
import Text from './typography/text'

// #CHANNGE_STYLE here is the style of the site (please refer to chakra-ui for more info)
const brandTheme = extendTheme({
  fonts,
  fontSizes,
  breakpoints,
  colors,
  radii,
  shadows,
  styles,
  fontWeights,
  sizes,
  components: {
    Heading,
    Text,
    Button,
    Checkbox,
    Radio,
    Switch,
    Menu,
    Tabs,
    Input,
    Textarea,
    Select,
    Table,
    Link,
  },
})

export default brandTheme

import {Divider, Heading, Text, useTheme} from '@chakra-ui/react'
import type {ReactNode} from 'react'

interface Props {
  title?: string
  description?: string
  separator?: boolean
  children: ReactNode
}

const FormSection = ({title, description, separator = false, children}: Props) => {
  const theme = useTheme()
  return (
    <>
      {title && <Heading variant='h6'>{title}</Heading>}
      {description && <Text textColor={theme.colors.brand.grey}>{description}</Text>}
      {children}
      {separator && <Divider borderColor={theme.colors.brand.lightGrey} />}
    </>
  )
}
export default FormSection

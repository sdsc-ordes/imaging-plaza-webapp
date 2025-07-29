import { HStack, Icon, Text, Tooltip, WrapItem, useTheme } from '@chakra-ui/react'
import React from 'react'

interface VariableItemProps {
  text: string
  label: string
  icon: React.ElementType
}

const VariableItem = ({ text, label, icon }: VariableItemProps) => {
  const theme = useTheme()

  return (
    <WrapItem>
      <Tooltip
        label={label}
        placement='top'
        hasArrow
        color={theme.colors.brand.white}
        bg={theme.colors.brand.primary}
        openDelay={800} // ⏱ delay in milliseconds
      >
        <HStack
          spacing={1}
          _hover={{ cursor: 'help' }}
        >
          <Icon as={icon} color="brand.primary" boxSize={3} />
          <Text variant='regular' color="brand.grey" noOfLines={1}>
            {text}
          </Text>
        </HStack>
      </Tooltip>
    </WrapItem>
  )
}

export default VariableItem
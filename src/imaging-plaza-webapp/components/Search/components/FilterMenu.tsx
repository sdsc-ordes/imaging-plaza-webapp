import { useState } from 'react';
import { Box, VStack, Checkbox } from '@chakra-ui/react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

interface Props {
    title: string
    items: string[]
    onChange: (selectedItems: string[]) => void
  }

const FilterMenu = ({title, items, onChange}: Props) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleCheckboxChange = (item: string) => {
        setSelectedItems((prevSelected) => {
          const newSelected = prevSelected.includes(item)
            ? prevSelected.filter((i) => i !== item)
            : [...prevSelected, item];
          onChange(newSelected);
          return newSelected;
        });
      };

    return (
        <Accordion allowMultiple width='full'>
            <AccordionItem border='none'>
                <AccordionButton bg="brand.superLightGreen" _hover={{ bg: 'brand.lightGreen' }} borderRadius='full'>
                    <Box as="span" flex="1" textAlign="left" color="brand.primary" fontWeight="semibold">
                        {title}
                    </Box>
                    <AccordionIcon color="brand.primary" />
                </AccordionButton>
                <AccordionPanel pb={4}>
                    <VStack align="start" spacing={2}>
                        {items.map((item) => (
                            <Checkbox id={item} key={item}
                            isChecked={selectedItems.includes(item)}
                            onChange={() => handleCheckboxChange(item)}>{item}</Checkbox>
                        ))}
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>

    )

}

export default FilterMenu
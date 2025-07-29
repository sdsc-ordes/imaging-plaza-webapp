import { VStack } from '@chakra-ui/react';
import { useState } from 'react';

import FilterMenu from './components/FilterMenu';
import { Filter, defaultFilters } from '@/models/Filter'


interface Props {
  onFilterChange: (filters: Filter[]) => void;
}

export const SearchFilters = ({ onFilterChange }: Props) => {
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);

  const handleFilterChange = (filterKey: string, selectedItems: string[]) => {
    setFilters((prevFilters) => {
      const newFilters = prevFilters.map((filter) =>
        filter.key === filterKey
          ? { ...filter, selected: selectedItems }
          : filter
      );
      onFilterChange(newFilters);
      return newFilters;
    });
  };


  return (
    <VStack spacing={8}>
      {filters.map((filter) => (
        <FilterMenu
          key={filter.key} 
          title={filter.title}
          items={filter.values}
          onChange={(selectedItems) => handleFilterChange(filter.key, selectedItems)}
        />
      ))}
    </VStack>
  )
}

export default SearchFilters
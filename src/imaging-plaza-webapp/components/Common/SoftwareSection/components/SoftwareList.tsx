import {Box} from '@chakra-ui/react'
import {SchemaSoftwareSourceCode} from '../../../Form/schema'
import VSoftwareCard from '../../SoftwareCard/VSoftwareCard'

interface Props {
  software: SchemaSoftwareSourceCode[] | null
}

const SoftwareList = ({software}: Props) => {
  return (
    <Box sx={{columnCount: {base: 1, md: 2, xl: 3}, gap: '4', rowGap: '4'}}>
      {software?.map((software: SchemaSoftwareSourceCode) => (
        <Box
          key={software['schema:identifier']}
          px={{base: 4, md: 0}}
          mb={4}
          w='full'
          position='relative'
          overflow='show'
          display='inline-block'>
          <VSoftwareCard software={software} />
        </Box>
      ))}
    </Box>
  )
}

export default SoftwareList

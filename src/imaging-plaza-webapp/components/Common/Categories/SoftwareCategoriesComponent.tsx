import {Box} from '@chakra-ui/react'
import {SoftwareProperty} from '../../../models/SoftwareProperties'
import {Translate} from 'next-translate'

interface Props {
  properties: SoftwareProperty[]
  push: (softwareProperty: SoftwareProperty) => string
  t: Translate
}

const SoftwareCategoriesComponent = ({properties, push, t}: Props) => {
  return (
    <>
      {properties.map(property => {
        return (
          <a href={push(property)} key={property.id} style={{marginInlineStart: '0px'}}>
            <Box
              border='2px solid'
              borderColor='#B3EAD9'
              borderRadius='1000px'
              px='1.25rem'
              py='0.5rem'
              _hover={{backgroundColor: '#E5F8F3'}}
              _active={{backgroundColor: '#E5F8F3'}}>
              {/*we are not in next territory, we cannot use next link*/}
              {t(`filters:${property.nameKey}`)}
            </Box>
          </a>
        )
      })}
    </>
  )
}

// noinspection JSUnusedGlobalSymbols
export default SoftwareCategoriesComponent

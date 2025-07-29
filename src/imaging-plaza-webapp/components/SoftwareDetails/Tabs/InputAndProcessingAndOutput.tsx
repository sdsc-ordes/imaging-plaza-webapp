import { Divider, VStack, Heading } from '@chakra-ui/react'
// import useTranslation from 'next-translate/useTranslation'
import { SchemaSoftwareSourceCode } from '../../Form/schema'
import SoftwareParameters from './Tables/SoftwareParameters'
import SoftwareImages from './Tables/SoftwareImages'
import SoftwareExecutableNotebooks from './Tables/SoftwareExecutableNotebooks'
import SoftwareDataFeeds from './Tables/SoftwareDataFeeds';
import useTranslation from 'next-translate/useTranslation'
import SoftwareRunnableExamples from './Tables/SoftwareRunnableExamples';

interface Props {
  software: SchemaSoftwareSourceCode
}

const InputAndProcessingAndOutput = ({ software }: Props) => {
  const { t } = useTranslation()
  return (
    <VStack w='full' alignItems='flex-start' spacing={10}>

      <Heading variant='h5' color='brand.primary' mb={4}>
        {t('software:details_tab_processing')}
      </Heading>

      <SoftwareDataFeeds software={software} />

      <SoftwareParameters software={software} />

      <SoftwareExecutableNotebooks software={software} />

      <SoftwareRunnableExamples software={software} />

      <SoftwareImages software={software} />

      <Divider />

      {/* Executable Instructions TODO: Use locale */}




    </VStack>
  )
}
export default InputAndProcessingAndOutput

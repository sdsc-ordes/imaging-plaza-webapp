import {Button, Heading, Icon, Text, VStack, useTheme} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import FairLevelImage from '../../components/SoftwareDetails/DetailsGrid/FairLevel'
import {ROUTES_FAQ} from '../../constants/routes'
import ChevronRight from '../Icons/light/ChevronRight.svg'
import {SchemaSoftwareSourceCode} from './schema'
import { useState, useEffect } from 'react';


interface Props {
  software: SchemaSoftwareSourceCode
}



const FairLevel = ({software}: Props) => {
  const {t} = useTranslation()
  const theme = useTheme()

  async function fetchData(uri: string, graph: string) {
    try {
      const encodedUri = encodeURIComponent(uri);
      const encodedGraph = encodeURIComponent(graph);
      const response = await fetch(`/api/softwares/indicate/?uri=${encodedUri}&graph=${encodedGraph}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const dataString = JSON.stringify(data);
      return dataString; // return the fetched data
    } catch (error) {
      console.error('Error:', error);
      return null; // return null in case of an error
    }
  }

  // Inside your component
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(software['schema:codeRepository'][0] ?? '', software['imag:graph'] ?? '')
      .then(data => setData(data as React.SetStateAction<any>))
      .catch(error => console.error(error));
  }, [software]);

  const parsedData = data ? JSON.parse(data) : null;
  // console.log(parsedData);

  return (
    <VStack
      p={8}
      w='full'
      spacing={4}
      borderRadius='big'
      alignItems='start'
      bg={theme.colors.brand.background}>
      <Heading variant='h5'>{t('form:fairStep_title')} </Heading>
      <VStack align='start'>
        <Text>{t('form:fairStep_description')}</Text>
        <Link href={ROUTES_FAQ} passHref>
          <Button variant='link' color={theme.colors.brand.primary}>
            {t('form:fairStep_link')}
            <Icon>
              <ChevronRight />
            </Icon>
          </Button>
        </Link>
      </VStack>

      {/* This is not the image but rather the image + text */}
      <FairLevelImage software={software} />

      <Heading variant='h5'>Fair Indications</Heading>
      {/* <Text>{software['schema:codeRepository']}</Text> */}
      {/* <Text>{software['imag:graph']}</Text> */}
      {/* <Text>{data}</Text> */}
      <Text>{(parsedData as any)?.results?.bindings?.map((item: any) => (
      <>
      <span key="textA">To achieve </span>
      <b key="textFair">{item.ToAchieve.value}</b>
      <span key="textB">, you need </span>
      <b key="textValue">{item.pathLabel.value}</b>
      <br />
      </>
    ))}
  </Text>
    </VStack>
  )
}

export default FairLevel

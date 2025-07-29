import {Button, Center, Heading, Text, VStack} from '@chakra-ui/react'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import {GetStaticProps} from 'next'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import CenteredContent from '../components/layouts/CenteredContent'
import {TeamMember} from '../models/TeamMember'
import {ROUTES_CONTACT} from '../constants/routes'
import HeadModule from '../components/Modules/HeaderModules'
import {getTeamMembers} from '../fetchers/teamMembers.server'
import TeamMembersGroup from '../components/About/TeamMembersGroup'

interface Props {
  teamMembers: TeamMember[]
}

const About = ({teamMembers}: Props) => {
  const {t} = useTranslation()

  const orderedMembers = sortBy(teamMembers, ['group'])
  const groups = groupBy<TeamMember>(orderedMembers, teamMember => teamMember.group)

  return (
    <CenteredContent title={t('about:about')}>
      <HeadModule title='about:meta_title' description='about:meta_title' />
      <VStack gridGap={6}>
        <Heading variant='h4' as='h2' alignSelf='start'>
          {t('about:about_text_title')}
        </Heading>
        <Text textAlign='start' w='full'>{t('about:text_1')}</Text>
        <Text textAlign='justify'>{t('about:text_2')}</Text>
        <Text textAlign='justify'>{t('about:text_3')}</Text>
        {/* BEGIN: abpxx6d04wxr */}
        <Text textAlign='start' w='full'>{t('about:text_4')}</Text>
        {/* END: abpxx6d04wxr */}
        <Text textAlign='start' w='full'>{t('about:text_5')}</Text>
        {/* <Text textAlign='start' w='full'>
          {t('about:text_4')}
        </Text> */}
        {groups && (
          <>
            {map(groups, (group: TeamMember[], key: string) => (
              /*@ts-ignore*/
              <TeamMembersGroup key={key} title={t(`about:${key}`)} teamMembers={group} />
            ))}
          </>
        )}
        <Center w='full'>
          <Link href={ROUTES_CONTACT} passHref>
            <Button variant='primary'>{t('about:contact_us')}</Button>
          </Link>
        </Center>
      </VStack>
    </CenteredContent>
  )
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps: GetStaticProps = async () => {
  const team = await getTeamMembers()

  return {
    props: {
      teamMembers: team,
    },
    revalidate: 900,
  }
}

// noinspection JSUnusedGlobalSymbols
export default About

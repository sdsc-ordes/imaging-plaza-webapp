import {Heading, SimpleGrid, VStack} from '@chakra-ui/react'
import {TeamMember} from '../../models/TeamMember'
import TeamMemberPresentation from './TeamMemberPresentation'

interface Props {
  title: string
  teamMembers: TeamMember[]
}

const TeamMembersGroup = ({title, teamMembers}: Props) => {
  return (
    <VStack alignItems='start' spacing={5}>
      <Heading as='h2' variant='h5'>
        {title}
      </Heading>
      <SimpleGrid w='full' columns={[1, 1, 3, 4]} gap={5}>
        {teamMembers
          .sort((a, b) => (a.order > b.order ? 1 : -1))
          .map((person: TeamMember) => (
            <TeamMemberPresentation member={person} key={person.name} />
          ))}
      </SimpleGrid>
    </VStack>
  )
}

export default TeamMembersGroup

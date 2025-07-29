import {Box, Text, VStack} from '@chakra-ui/react'
import {TeamMember} from '../../models/TeamMember'
import dynamic from 'next/dynamic'

const Image = dynamic(() => import('next/image'))

interface Props {
  member: TeamMember
}

const TeamMemberPresentation = ({member}: Props) => {
  return (
    <VStack width='full'>
      <Box w='full' minH={300} maxH={400}>
        {member.picture && (
          <Image
            style={{borderRadius: '16px'}}
            src={member.picture}
            height={400}
            width={300}
            objectFit='cover'
            alt={member.titleEn}
          />
        )}
      </Box>
      <Text variant='semiBold' align='start' w='full'>
        {member.name}
      </Text>
      <Text align='start' w='full'>
        {member.titleEn}
      </Text>
      <Text variant='small'>{member.descEn}</Text>
    </VStack>
  )
}

export default TeamMemberPresentation

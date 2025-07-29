import {Stack, Text, VStack} from '@chakra-ui/react'
import Image from 'next/image'
import {useAuth} from '../../utils/AuthContext'

const UserDetails = () => {
  const {user} = useAuth()

  return (
    <Stack direction={{base: 'column', md: 'row'}} spacing={6} w='full' alignItems='center'>
      <Image
        src={user?.firebase?.photoURL ?? '/icons/user_image.svg'}
        width={102}
        height={102}
        alt='user'
        style={{borderRadius: '100%'}}
      />
      <VStack alignItems={{base: 'center', md: 'flex-start'}}>
        <Text variant='semiBold'>
          {user && user.firstName} {user && user.lastName}
        </Text>
        <Text variant='small'>{user && user.email}</Text>
      </VStack>
    </Stack>
  )
}

export default UserDetails

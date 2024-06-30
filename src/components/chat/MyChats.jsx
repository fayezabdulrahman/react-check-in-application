import { Box, VStack, Text, Heading, Button, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { client } from '../../util/axios-util';
import { useChat } from '../../context/ChatProvider';
import { useAuth } from '../../context/AuthProvider';
import { getSender } from '../../util/chat-logic';
import Loading from '../shared/Loading';

const chats = [
  { name: 'Piyush', message: '' },
  { name: 'Guest User', message: 'woooo' },
  { name: 'Time', message: 'yo', sender: 'Roadside Coder' },
  { name: 'RoadSide Coder Fam ⭐', message: '✌️😍❤️❤️', sender: 'Guest User' },
  { name: 'Youtube Demo', message: 'ssup', sender: 'Guest User' },
  {
    name: 'Karle Vedant Prasad',
    message: 'hello there',
    sender: 'Karle Vedant Prasad'
  }
];

const MyChats = () => {
  const { setUserChats, userChats } = useChat();
  const [loading, setLoading] = useState(true);

  const { userState } = useAuth();
  useEffect(() => {
    const fetchChats = async () => {
      await client
        .get('/chats/fetchChats')
        .then((response) => {
          if (response.data) {
            const chatsRetrieved = response.data.chats;
            setUserChats(chatsRetrieved);
          }
        })
        .catch((error) => {
          console.log('error fetching user chats');
          console.log(error);
        })
        .finally(() => setLoading(false));
    };

    fetchChats();
  }, []);
  console.log(userChats);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Box
        w={{ base: '100%', md: '30%' }}
        borderRight="1px solid"
        borderColor="gray.200"
        p={4}
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">My Chats</Heading>
          <Button size="sm">New Group Chat +</Button>
        </Flex>
        <VStack align="stretch">
          {userChats.map((chat, index) => (
            <Box
              key={index}
              p={3}
              bg="gray.50"
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
            >
              <Text>
                {!chat.isGroupChat
                  ? getSender(userState, chat.users)
                  : chat.chatName}
              </Text>
              {chat.latestMessage && (
                <Text fontSize="xs">
                  <b>{chat.latestMessage.sender.firstName} : </b>
                  {chat.latestMessage.content.length > 50
                    ? chat.latestMessage.content.substring(0, 51) + '...'
                    : chat.latestMessage.content}
                </Text>
              )}
            </Box>
          ))}
        </VStack>
      </Box>
    </>
  );
};

export default MyChats;

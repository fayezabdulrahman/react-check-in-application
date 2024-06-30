import { Flex } from '@chakra-ui/react';
import MyChats from '../components/chat/MyChats';
import LiveChat from '../components/chat/LiveChat';

const ChatPage = () => {
  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} height="91.5vh">
        <MyChats />
        <LiveChat />
      </Flex>
    </>
  );
};

export default ChatPage;

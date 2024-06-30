import { useContext, createContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const chatContext = useContext(ChatContext);
  if (!ChatContext) {
    throw new Error('useChat must be used within a Chat Provider');
  }
  return chatContext;
};
const ChatProvider = ({ children }) => {
  const [userChats, setUserChats] = useState();

  const ctxValue = {
    userChats,
    setUserChats
  };
  return (
    <ChatContext.Provider value={ctxValue}>{children}</ChatContext.Provider>
  );
};

export default ChatProvider;

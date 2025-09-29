import React from 'react';
import { ChatContainer } from '../components/Chat';

export const ChatPage: React.FC = () => {
  console.log('💬 ChatPage component renderizando...');
  
  return (
    <ChatContainer className="h-full" />
  );
};

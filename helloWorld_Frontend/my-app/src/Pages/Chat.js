import React from "react";
import InboxList from "../Components/Chat/InboxList";
import ChatWindow from "../Components/Chat/ChatWindow";
import { ChatProvider } from "../Components/Chat/ChatContext";


const Chat = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-black text-white">
        <InboxList />
        <div className="flex-1 h-full">
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Chat;

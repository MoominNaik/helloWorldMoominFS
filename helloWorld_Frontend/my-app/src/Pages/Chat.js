import React, { useEffect } from "react";
import InboxList from "../Components/Chat/InboxList";
import ChatWindow from "../Components/Chat/ChatWindow";
import { useChat } from "../Components/Chat/ChatContext";
import { useParams } from "react-router-dom";


const Chat = () => {
  const { username } = useParams();
  const { allUsers, setSelectedUser } = useChat();

  useEffect(() => {
    if (!username) return;
    if (!allUsers || allUsers.length === 0) return;
    const target = allUsers.find((u) => (u.username || u.name) === decodeURIComponent(username));
    if (target) {
      setSelectedUser(target);
    }
  }, [username, allUsers, setSelectedUser]);

  return (
    <div className="fixed inset-0 flex bg-black text-white overflow-hidden pr-80">
      {/* Inbox List */}
      <div className="w-80 border-r border-gray-800 flex-shrink-0 h-full bg-gray-900 z-20">
        <InboxList />
      </div>
      
      {/* Chat Window */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative z-0">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;

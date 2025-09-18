
import React, { useRef, useEffect, useState } from "react";
import { useChat } from "./ChatContext";
import { useAuth } from "../../AuthContext";

const ChatWindow = () => {
  const { messages, sendMessage, loading, error, selectedUser } = useChat();
  const { user: loggedInUser } = useAuth();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-gray-400">
        <span>Select a user to start messaging</span>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    if (!loggedInUser) return;
    sendMessage({ sender: loggedInUser.username || loggedInUser.name, content: input });
    setInput("");
  };

  // Show both sent and received messages between logged-in user and selected user
  const currentUsername = loggedInUser?.username || loggedInUser?.name;
  const selectedUsername = selectedUser?.username || selectedUser?.name;
  const chatMessages = messages
    .filter(
      (msg) =>
        (msg.sender === currentUsername && msg.recipient === selectedUsername) ||
        (msg.sender === selectedUsername && msg.recipient === currentUsername) ||
        // fallback for systems without recipient field: show all between these two users
        (msg.sender === currentUsername || msg.sender === selectedUsername)
    )
    .sort((a, b) => {
      // If both have numeric ids, sort by id ascending (oldest to newest)
      if (typeof a.id === 'number' && typeof b.id === 'number') {
        return a.id - b.id;
      }
      // Otherwise, fallback to original order
      return 0;
    });

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900 flex items-center">
        <div className="text-lg font-bold text-green-400">{selectedUser.username || selectedUser.name}</div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black">
        {loading && <div className="text-gray-400">Loading messages...</div>}
        {error && <div className="text-red-400">{error.message || "Error loading messages"}</div>}
        {chatMessages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`flex ${msg.sender === currentUsername ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow-lg text-sm font-medium break-words bg-gray-800 text-gray-200 border border-gray-700`}
            >
              <span className="block mb-1 text-xs text-gray-300">
                  {msg.sender}
              </span>
                {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center px-6 py-4 border-t border-gray-800 bg-gray-900"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 rounded-lg shadow-md transition text-white font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

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
      <div className="flex-1 flex items-center justify-center bg-black text-gray-400 text-sm">
        Select a user to start messaging
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !loggedInUser) return;
    sendMessage({ sender: loggedInUser.username || loggedInUser.name, content: input });
    setInput("");
  };

  const currentUsername = loggedInUser?.username || loggedInUser?.name;
  const selectedUsername = selectedUser?.username || selectedUser?.name;
  const chatMessages = messages
    .filter(
      (msg) =>
        (msg.sender === currentUsername && msg.recipient === selectedUsername) ||
        (msg.sender === selectedUsername && msg.recipient === currentUsername) ||
        (msg.sender === currentUsername || msg.sender === selectedUsername)
    )
    .sort((a, b) => (a.id && b.id ? a.id - b.id : 0));

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-800 bg-gray-900 flex items-center">
        <div className="text-lg font-bold text-green-400">{selectedUser.username || selectedUser.name}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-black">
        {loading && <div className="text-gray-400 text-sm">Loading messages...</div>}
        {error && <div className="text-red-400 text-sm">{error.message || "Error loading messages"}</div>}
        {chatMessages.map((msg, idx) => {
          const isSentByCurrentUser = msg.sender === currentUsername;
          return (
            <div key={msg.id || idx} className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-xl shadow-md text-sm break-words ${
                  isSentByCurrentUser
                    ? "bg-green-500 text-white"
                    : "bg-gray-800 text-gray-200 border border-gray-700"
                }`}
              >
                {!isSentByCurrentUser && (
                  <span className="block mb-1 text-xs text-gray-400">{msg.sender}</span>
                )}
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center px-6 py-3 border-t border-gray-800 bg-gray-900"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="ml-3 px-5 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium text-sm transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
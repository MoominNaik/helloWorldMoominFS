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
      <div className="flex-1 flex items-center justify-center bg-black text-gray-400 font-mono text-sm">
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
    <div className="flex flex-col h-full bg-black font-mono text-green-400 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900 flex items-center justify-center shadow-[0_0_10px_0_#00FF7F] sticky top-0 z-10">
        <div className="text-lg font-bold text-green-400 text-center">{selectedUser.username || selectedUser.name}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 h-0">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="text-gray-400 text-sm">Loading messages...</div>
          </div>
        )}
        {error && (
          <div className="flex justify-center py-4">
            <div className="text-red-400 text-sm">{error.message || "Error loading messages"}</div>
          </div>
        )}
        <div className="max-w-4xl mx-auto w-full px-2 space-y-4 py-2">
          {chatMessages.map((msg, idx) => {
            const isSentByCurrentUser = msg.sender === currentUsername;
            const showSender = !isSentByCurrentUser && 
              (idx === 0 || chatMessages[idx - 1]?.sender !== msg.sender);
            
            return (
              <div 
                key={msg.id || idx} 
                className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isSentByCurrentUser
                    ? 'bg-green-900 text-white'
                    : 'bg-gray-900 text-white'
                  }`}
                >
                  {showSender && (
                    <span className="block text-xs text-gray-400 mb-1">
                      {msg.sender}
                    </span>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div className="text-right mt-1">
                    <span className="text-2xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} className="h-4" />
      </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="sticky bottom-0 bg-gray-900 border-t border-gray-800 shadow-[0_0_15px_0_#00FF7F] px-4 py-3 z-10 flex-shrink-0 w-full"
      >
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-sm bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm placeholder-gray-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-2 bg-green-500 text-white font-medium text-sm rounded-sm hover:shadow-[0_0_15px_0_#00FF7F] transition-all duration-200 hover:bg-green-600 active:scale-95"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
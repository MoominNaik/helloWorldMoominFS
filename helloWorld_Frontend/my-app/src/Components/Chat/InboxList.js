

import React, { useState } from "react";
import { useChat } from "./ChatContext";
import { useAuth } from "../../AuthContext";


const InboxList = () => {

  const { allUsers, allMessages, messages, selectedUser, setSelectedUser, loading, error, refreshMessages } = useChat();
  const { user: loggedInUser } = useAuth();
  const [search, setSearch] = useState("");

  // Find last message for each user (if any)

  // Build inbox users: only users you have messaged or received messages from (using allMessages)
  const currentUsername = loggedInUser?.username || loggedInUser?.name;
  
  const inboxUsernames = Array.from(
    new Set(
      allMessages
        .flatMap((msg) => [msg.sender, msg.recipient])
        .filter((u) => u && u !== currentUsername)
    )
  );
  
  const inboxUsers = allUsers.filter(
    (user) => inboxUsernames.includes(user.username || user.name)
  );

  // Filter users by search query (case-insensitive, matches username or name)
  const filteredUsers = allUsers.filter((user) => {
    const q = search.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(q)) ||
      (user.name && user.name.toLowerCase().includes(q))
    );
  });

  // Show inbox users if not searching, otherwise show filtered users for search
  const usersToShow = search ? filteredUsers : inboxUsers;
  
  const usersWithLastMsg = usersToShow.map((user) => {
    const lastMsg = allMessages
      .filter(
        (m) =>
          (m.sender === currentUsername && m.recipient === (user.username || user.name)) ||
          (m.sender === (user.username || user.name) && m.recipient === currentUsername)
      )
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))[0]; // Get most recent message
    
    return {
      ...user,
      lastMessage: lastMsg ? lastMsg.content : "No messages yet.",
      unread: 0, // You can implement unread logic as needed
    };
  });

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-800 h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-bold text-green-400">Inbox</h2>
        <button
          onClick={refreshMessages}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
          title="Refresh messages"
        >
          ↻
        </button>
      </div>
      {loading && <div className="text-gray-400 p-4">Loading users...</div>}
      {error && <div className="text-red-400 p-4">{error.message || "Failed to fetch users"}</div>}
      {!loading && !error && usersWithLastMsg.length === 0 && !search && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-gray-400">
            <div className="text-lg mb-2">No conversations yet</div>
            <div className="text-sm">Search for users to start messaging</div>
          </div>
        </div>
      )}
      <ul className="flex-1 overflow-y-auto">
        {usersWithLastMsg.map((user) => (
          <li
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`px-4 py-3 cursor-pointer flex items-center justify-between border-b border-gray-800 transition bg-opacity-80 hover:bg-gray-800 ${selectedUser && selectedUser.id === user.id ? "bg-gray-800" : ""}`}
          >
            <div>
              <div className="font-semibold text-white">{user.username || user.name}</div>
              <div className="text-gray-400 text-xs truncate max-w-[140px]">{user.lastMessage}</div>
            </div>
            {user.unread > 0 && (
              <span className="ml-2 bg-green-500 text-xs text-white rounded-full px-2 py-0.5 font-bold">
                {user.unread}
              </span>
            )}
          </li>
        ))}
      </ul>
      {/* Search results dropdown */}
      {search && (
        <div className="absolute bottom-20 left-0 w-72 z-10 bg-gray-900 border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-gray-400">No users found.</div>
          ) : (
            <ul>
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => { setSelectedUser(user); setSearch(""); }}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-800 border-b border-gray-800 last:border-b-0 text-white"
                >
                  {user.username || user.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="p-4 border-t border-gray-800 relative">
        <input
          type="text"
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default InboxList;

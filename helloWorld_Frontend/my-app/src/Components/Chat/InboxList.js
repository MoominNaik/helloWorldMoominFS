import React, { useState } from "react";
import { useChat } from "./ChatContext";
import { useAuth } from "../../AuthContext";

const InboxList = () => {
  const { allUsers, allMessages, selectedUser, setSelectedUser, loading, error, refreshMessages } = useChat();
  const { user: loggedInUser } = useAuth();
  const [search, setSearch] = useState("");

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

  const filteredUsers = allUsers.filter((user) => {
    const q = search.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(q)) ||
      (user.name && user.name.toLowerCase().includes(q))
    );
  });

  const usersToShow = search ? filteredUsers : inboxUsers;

  const usersWithLastMsg = usersToShow.map((user) => {
    const lastMsg = allMessages
      .filter(
        (m) =>
          (m.sender === currentUsername && m.recipient === (user.username || user.name)) ||
          (m.sender === (user.username || user.name) && m.recipient === currentUsername)
      )
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))[0];

    return {
      ...user,
      lastMessage: lastMsg ? lastMsg.content : "No messages yet.",
      unread: 0,
    };
  });

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col font-mono text-green-400">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-center shadow-[0_0_5px_0_#00FF7F] flex-shrink-0">
        <h2 className="text-xl font-bold text-green-400">Inbox</h2>
        {/* Refresh button commented out
        <button
          onClick={refreshMessages}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-sm transition shadow-[0_0_5px_0_#00FF7F]"
          title="Refresh messages"
        >
          ↻
        </button>
        */}
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

      <div className="flex-1 overflow-y-auto h-0">
        <ul className="divide-y divide-gray-800">
        {usersWithLastMsg.map((user) => (
          <li
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`px-4 py-3 cursor-pointer flex items-center justify-between border-b border-gray-800 transition bg-opacity-80 hover:bg-gray-800 shadow-[0_0_5px_0_#00FF7F] ${
              selectedUser && selectedUser.id === user.id ? "bg-gray-800" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-green-400 truncate">{user.username || user.name}</div>
              <div className="text-gray-400 text-xs truncate">{user.lastMessage}</div>
            </div>
            {user.unread > 0 && (
              <span className="ml-2 bg-green-500 text-xs text-white rounded-sm px-2 py-0.5 font-bold">
                {user.unread}
              </span>
            )}
          </li>
        ))}
        </ul>
      </div>

      {/* Search input */}
      <div className="p-4 border-t border-gray-800 shadow-[0_0_5px_0_#00FF7F] relative flex-shrink-0">
        <input
          type="text"
          className="w-full px-3 py-2 rounded-sm bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default InboxList;
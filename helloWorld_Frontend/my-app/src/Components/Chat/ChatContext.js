// src/Components/Chat/ChatContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as chatApi from "./api";
import { useAuth } from "../../AuthContext";

export const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user: loggedInUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all messages involving the logged-in user
  const fetchAllMessages = useCallback(async () => {
    if (!loggedInUser) {
      setAllMessages([]);
      return;
    }

    setLoading(true);
    try {
      const currentUsername = loggedInUser.username || loggedInUser.name;
      const msgs = await chatApi.getMessagesBySender(currentUsername);
      setAllMessages(msgs);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [loggedInUser]);

  // Fetch messages between logged-in user and selected user
  const fetchMessages = useCallback(async () => {
    if (!selectedUser || !loggedInUser) {
      setMessages([]);
      return;
    }

    setLoading(true);
    try {
      const msgs = await chatApi.getMessagesBetweenUsers(
        loggedInUser.username || loggedInUser.name,
        selectedUser.username || selectedUser.name
      );
      setMessages(msgs);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedUser, loggedInUser]);

  // Send a message to the selected user
  const sendMessage = useCallback(
    async (msg) => {
      if (!selectedUser || !loggedInUser) return;

      const tempId = Date.now();
      const optimisticMsg = { ...msg, id: tempId, sender: loggedInUser.username || loggedInUser.name };
      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        await chatApi.sendMessage({
          ...msg,
          recipient: selectedUser.username || selectedUser.name,
          sender: loggedInUser.username || loggedInUser.name,
        });

        await fetchMessages();
        await fetchAllMessages();
      } catch (err) {
        setError(err);
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    },
    [selectedUser, loggedInUser, fetchMessages, fetchAllMessages]
  );

  const deleteMessage = useCallback(async (id) => {
    setLoading(true);
    try {
      await chatApi.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMessages = useCallback(async (keyword) => {
    setLoading(true);
    try {
      const results = await chatApi.searchMessages(keyword);
      setMessages(results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMessages = useCallback(() => {
    fetchMessages();
    fetchAllMessages();
  }, [fetchMessages, fetchAllMessages]);

  // Fetch all users for inbox/search
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await chatApi.getAllUsers();
        const username = loggedInUser?.username || loggedInUser?.name;
        const filteredUsers = users.filter((u) => (u.username || u.name) !== username);
        setAllUsers(filteredUsers);
      } catch (err) {
        setError(err);
      }
    };
    loadUsers();
  }, [loggedInUser]);

  // Fetch all messages on mount or when logged-in user changes
  useEffect(() => {
    fetchAllMessages();
  }, [fetchAllMessages]);

  // Fetch selected user's messages when selection changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        allMessages,
        allUsers,
        selectedUser,
        setSelectedUser,
        loading,
        error,
        sendMessage,
        deleteMessage,
        searchMessages,
        fetchAllMessages,
        refreshMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
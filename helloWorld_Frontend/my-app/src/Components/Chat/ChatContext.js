// src/Components/Chat/ChatContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as chatApi from "./api";
import { useAuth } from "../../AuthContext";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // current chat messages
  const [allMessages, setAllMessages] = useState([]); // all messages for inbox
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const { user: loggedInUser } = useAuth();

  // Fetch all messages for the logged-in user (for inbox)
  const fetchAllMessages = useCallback(() => {
    if (loggedInUser) {
      const currentUsername = loggedInUser.username || loggedInUser.name;
      setLoading(true);
      chatApi.getMessagesBySender(currentUsername)
        .then((messages) => {
          setAllMessages(messages);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => setLoading(false));
    } else {
      setAllMessages([]);
    }
  }, [loggedInUser]);

  // Function to fetch messages between logged in user and selected user
  const fetchMessages = useCallback(() => {
    if (selectedUser && loggedInUser) {
      const currentUsername = loggedInUser.username || loggedInUser.name;
      const selectedUsername = selectedUser.username || selectedUser.name;
      setLoading(true);
      chatApi.getMessagesBetweenUsers(currentUsername, selectedUsername)
        .then(setMessages)
        .catch(setError)
        .finally(() => setLoading(false));
    } else {
      setMessages([]);
    }
  }, [selectedUser, loggedInUser]);

  // Fetch all users from backend
  useEffect(() => {
    chatApi.getAllUsers()
      .then(users => {
        // Exclude logged in user from the list
        const username = loggedInUser?.username || loggedInUser?.name;
        const filteredUsers = users.filter(u => (u.username || u.name) !== username);
        setAllUsers(filteredUsers);
      })
      .catch((err) => {
        setError(err);
      });
  }, [loggedInUser]);

  // Load all messages for inbox on mount and when user changes
  useEffect(() => {
    fetchAllMessages();
  }, [fetchAllMessages]);

  // Load messages for current chat when selected user changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Send a new message
  const sendMessage = useCallback(async (msg) => {
    setLoading(true);
    // Optimistically add the message for instant feedback
    const tempId = Date.now();
    const optimisticMsg = { ...msg, id: tempId };
    setMessages((prev) => [...prev, optimisticMsg]);
    try {
      // Add recipient from selectedUser to message before sending
      const msgWithRecipient = { ...msg, recipient: selectedUser?.username || selectedUser?.name };
      const newMsg = await chatApi.sendMessage(msgWithRecipient);
      // Refresh both current conversation and inbox after sending
      fetchMessages();
      fetchAllMessages();
    } catch (err) {
      setError(err);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(m => m.id !== tempId));
    }
    setLoading(false);
  }, [selectedUser, fetchMessages, fetchAllMessages]);

  // Delete a message
  const deleteMessage = useCallback(async (id) => {
    setLoading(true);
    try {
      await chatApi.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, []);

  // Search messages
  const searchMessages = useCallback(async (keyword) => {
    setLoading(true);
    try {
      const results = await chatApi.searchMessages(keyword);
      setMessages(results);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, []);

  // Manual refresh function for when user wants to check for new messages
  const refreshMessages = useCallback(() => {
    fetchMessages();
    fetchAllMessages();
  }, [fetchMessages, fetchAllMessages]);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      allMessages, 
      loading, 
      error, 
      sendMessage, 
      deleteMessage, 
      searchMessages, 
      selectedUser, 
      setSelectedUser, 
      allUsers, 
      fetchAllMessages,
      refreshMessages 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

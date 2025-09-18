
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { user: CURRENT_USER } = useAuth();
  const [rightSwipedPosts, setRightSwipedPosts] = useState([]);
  const [chatMessages, setChatMessages] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  const addRightSwipedPost = (post) => {
    setRightSwipedPosts((prev) => [
      { ...post, swipedAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const addContributionMessage = (post, fromUser) => {
    const toUserId = post.userId;
    const msg = {
      user: fromUser.name,
      text: `wants to contribute to your post: "${post.title}"`,
      time: new Date().toISOString(),
    };
    setChatMessages((prev) => {
      const update = { ...prev };
      update[toUserId] = [...(update[toUserId] || []), { ...msg }];
      update[fromUser.id] = [...(update[fromUser.id] || []), { ...msg }];
      return update;
    });
  };

  const addNewPost = (post) => {
    setUserPosts((prev) => [post, ...prev]);
  };

  const fetchUserPosts = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:9091/api/posts/user/${userId}`);
      setUserPosts(res.data);
    } catch (err) {
      setUserPosts([]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        CURRENT_USER,
        rightSwipedPosts,
        addRightSwipedPost,
        chatMessages,
        addContributionMessage,
        userPosts,
        addNewPost,
        fetchUserPosts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

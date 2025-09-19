import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { getRightSwipedPosts } from "../Components/Feed/api";
import { useChat } from "../Components/Chat/ChatContext";

const formatTime = (iso) => {
  const date = new Date(iso);
  return date.toLocaleString();
};

const RightSwiped = () => {
  const { CURRENT_USER } = useAppContext();
  const { setSelectedUser } = useChat();
  const navigate = useNavigate();
  const [rightSwipedPosts, setRightSwipedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRightSwipes() {
      setLoading(true);
      setError(null);
      try {
        const res = await getRightSwipedPosts(CURRENT_USER.id);
        setRightSwipedPosts(res.data);
      } catch (err) {
        setError("Failed to fetch right swiped posts.");
      }
      setLoading(false);
    }
    fetchRightSwipes();
  }, [CURRENT_USER.id]);

  const openChatWithUser = (user) => {
    setSelectedUser(user); // set selected user in chat context
    navigate("/chat");     // navigate to chat page
  };

  return (
    <div className="min-h-screen bg-black p-10">
      <h1 className="text-3xl font-bold text-green-400 mb-8">Right Swiped Posts</h1>
      {loading && <div className="text-gray-400 text-center">Loading...</div>}
      {error && <div className="text-red-400 text-center">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!loading && rightSwipedPosts.length === 0 && (
          <div className="text-gray-400 col-span-full text-center text-lg">
            No right swiped posts yet.
          </div>
        )}
        {rightSwipedPosts.map((post, idx) => (
          <div
            key={post.userId || idx} // unique key per user
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
              <p className="text-gray-400 mb-4">{post.description}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-green-400 font-medium">{post.user}</span>
              <span className="text-xs text-gray-500">
                {post.swipedAt ? formatTime(post.swipedAt) : formatTime(post.timestamp)}
              </span>
            </div>
            <button
              onClick={() =>
                openChatWithUser({ id: post.userId, username: post.user })
              }
              className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
            >
              Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSwiped;
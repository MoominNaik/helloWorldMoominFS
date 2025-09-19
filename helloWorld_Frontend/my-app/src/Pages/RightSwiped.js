import React, { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { getRightSwipedPosts } from "../Components/Feed/api";

const formatTime = (iso) => {
  const date = new Date(iso);
  return date.toLocaleString();
};

const RightSwiped = () => {
  const { CURRENT_USER } = useAppContext();
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

  return (
    <div className="min-h-screen bg-black p-8 md:p-12 lg:p-16 font-mono text-green-400">
      <div className="mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-green-400 text-center mb-6">
          you said hello 
        </h1>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 mt-8 pt-8 border-t-2 border-gray-900">
        {loading && <div className="text-gray-400 text-center text-sm">Loading...</div>}
        {error && <div className="text-red-400 text-center text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-8">
        {!loading && rightSwipedPosts.length === 0 && (
          <div className="text-gray-400 col-span-full text-center text-lg">
            No right swiped posts yet.
          </div>
        )}

        {rightSwipedPosts.map((post, idx) => (
          <div
            key={post.userId || idx}
            className="bg-gray-900 p-6 shadow-lg border border-gray-700 flex flex-col justify-between w-72 transition-all duration-300 hover:shadow-[0_0_30px_0_#00FF7F]"
          >
            <div className="mb-3">
              <h2 className="text-base md:text-lg font-bold text-green-400 mb-1.5">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm">{post.description}</p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-green-400 text-sm font-medium">{post.user}</span>
              <span className="text-xs text-gray-500">
                {post.swipedAt ? formatTime(post.swipedAt) : formatTime(post.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default RightSwiped;
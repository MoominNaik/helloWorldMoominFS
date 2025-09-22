import React, { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { getRightSwipedPosts } from "../Components/Feed/api";
import { useNavigate } from "react-router-dom";

const formatTime = (iso) => {
  const date = new Date(iso);
  return date.toLocaleString();
};

const RightSwiped = () => {
  const { CURRENT_USER } = useAppContext();
  const [rightSwipedPosts, setRightSwipedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // util to build usable image URL like in Post.js
  const resolveImageSrc = (post) => {
    const BACKEND_ORIGIN = "http://localhost:9091";
    const IMAGE_BASE = `${BACKEND_ORIGIN}/uploads/`;
    const rawImage = post?.imageUrl || post?.image || null;
    if (!rawImage || typeof rawImage !== "string") return null;
    if (/^https?:\/\//i.test(rawImage)) return rawImage;
    if (rawImage.startsWith("/")) return `${BACKEND_ORIGIN}${rawImage}`;
    return `${IMAGE_BASE}${encodeURIComponent(rawImage)}`;
  };

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

        {rightSwipedPosts.map((post, idx) => {
          const imgSrc = resolveImageSrc(post);
          const authorName = post?.author?.username || post?.user || "Unknown";
          const when = post?.swipedAt || post?.timestamp;
          return (
            <div
              key={post.id || idx}
              className="bg-gray-900 border-2 border-green-400 shadow-[0_0_15px_#22c55e] rounded-lg p-4 w-full max-w-sm transition-all duration-300 hover:shadow-[0_0_25px_#22c55e]"
            >
              {/* Image */}
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={post.title || "Project image"}
                  className="w-full h-40 object-cover mb-4 border border-green-500 rounded-md"
                />
              ) : (
                <div className="w-full h-40 bg-gray-800 mb-4 flex items-center justify-center text-green-400 text-sm border border-green-500 rounded-md">
                  [ IMAGE NOT PROVIDED ]
                </div>
              )}

              {/* Title */}
              <h2 className="text-xl font-bold text-green-400 mb-2 text-center tracking-wider">
                {post.title}
              </h2>

              {/* Description */}
              <div className="mb-3 text-gray-300 bg-black/30 rounded-md border border-green-800/40 p-3 text-center">
                <p className="text-sm leading-relaxed">{post.description}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-3">
                {post.category && (
                  <span className="px-2.5 py-0.5 text-xs uppercase tracking-wider rounded-full border border-green-500 text-green-300 bg-green-500/10">
                    {post.category}
                  </span>
                )}
                {post.stack && (
                  <span className="px-2.5 py-0.5 text-xs uppercase tracking-wider rounded-full border border-green-500 text-green-300 bg-green-500/10">
                    {post.stack}
                  </span>
                )}
              </div>

              {/* Footer: author + time */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-green-300 text-xs">{authorName}</span>
                <span className="text-xs text-gray-500">{when ? formatTime(when) : ""}</span>
              </div>

              {/* Actions */}
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate(`/chat/${encodeURIComponent(authorName)}`)}
                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-sm transition shadow-[0_0_8px_0_#00FF7F]"
                  title={`Chat with ${authorName}`}
                >
                  Chat
                </button>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default RightSwiped;
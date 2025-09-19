import React, { useState } from "react";

const Post = ({ post, onRightSwipe, onLeftSwipe }) => {
  const [open, setOpen] = useState(false);

  // Construct image URL if post.image exists
  const imageUrl = post.image
    ? `http://localhost:9091/uploads/${post.image}` // adjust if backend serves images differently
    : null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6 w-full flex flex-col items-center justify-center">
      
      {/* Image from backend */}
      <div className="w-full h-64 mb-4 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Title + Description */}
      <h2 className="text-xl font-semibold mb-2 text-white text-center">{post.title}</h2>
      <p className="text-gray-400 mb-4 text-center">{post.description}</p>

      {/* User info centered */}
      <div className="flex flex-col items-center mb-4 w-full">
        <p className="text-sm text-gray-500 text-center">{post.user}</p>
      </div>

      {/* Navigation buttons centered */}
      <div className="flex justify-center w-full max-w-[90%] mx-auto px-4 mt-6 space-x-8">
        <button
          onClick={onLeftSwipe}
          className="px-6 py-2 bg-gray-900 text-red-500 rounded-lg text-xl font-bold hover:bg-gray-800 transition-colors"
        >
          &lt;
        </button>
        <button
          onClick={onRightSwipe}
          className="px-6 py-2 bg-gray-900 text-green-500 rounded-lg text-xl font-bold hover:bg-gray-800 transition-colors"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Post;
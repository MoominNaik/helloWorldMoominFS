import React from "react";
import { motion } from "framer-motion";

const Post = ({ post, onRightSwipe, onLeftSwipe }) => {
  return (
    <motion.div
      className="bg-gray-900 border-2 border-green-400 shadow-[0_0_15px_#22c55e] p-6 w-full max-w-2xl mx-auto my-8 rounded-lg"
      whileHover={{ scale: 1.02, boxShadow: "0 0 25px #22c55e" }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Image placeholder */}
      <div className="w-full h-64 bg-gray-800 mb-6 flex items-center justify-center text-green-400 text-lg border border-green-500 rounded-lg">
        [ IMAGE PLACEHOLDER ]
      </div>

      {/* Title + Description */}
      <h2 className="text-2xl font-bold mb-3 text-green-400 text-center tracking-wide">
        {post.title}
      </h2>
      <p className="text-gray-300 mb-6 text-center">{post.description}</p>

      {/* User info */}
      <div className="mb-6 w-full text-center">
        <p className="text-sm text-gray-400">Posted by {post.user}</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-8">
        <motion.button
          onClick={onLeftSwipe}
          className="px-6 py-2 border-2 border-red-500 text-red-500 text-xl font-bold hover:bg-red-500 hover:text-black transition-colors shadow-[0_0_10px_#ef4444]"
          whileTap={{ scale: 0.9 }}
        >
          &lt;
        </motion.button>
        <motion.button
          onClick={onRightSwipe}
          className="px-6 py-2 border-2 border-green-500 text-green-500 text-xl font-bold hover:bg-green-500 hover:text-black transition-colors shadow-[0_0_10px_#22c55e]"
          whileTap={{ scale: 0.9 }}
        >
          &gt;
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Post;
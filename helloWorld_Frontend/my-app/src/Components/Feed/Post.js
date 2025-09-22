import React, { useState } from "react";
import { motion } from "framer-motion";

const Post = ({ post, onRightSwipe, onLeftSwipe }) => {
  // Build a usable image URL. Prefer post.imageUrl; otherwise, map filename to backend static path.
  const BACKEND_ORIGIN = "http://localhost:9091"; // change if your backend host/port differs
  const IMAGE_BASE = `${BACKEND_ORIGIN}/uploads/`; // change if your static path differs
  const rawImage = post?.imageUrl || post?.image || null;
  let imageSrc = null;
  if (rawImage) {
    if (typeof rawImage === "string" && /^https?:\/\//i.test(rawImage)) {
      // already a full URL
      imageSrc = rawImage;
    } else if (typeof rawImage === "string" && rawImage.startsWith("/")) {
      // backend-absolute path like /uploads/foo.png
      imageSrc = `${BACKEND_ORIGIN}${rawImage}`;
    } else if (typeof rawImage === "string") {
      // treat as filename
      imageSrc = `${IMAGE_BASE}${encodeURIComponent(rawImage)}`;
    }
  }
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(imageSrc) && !imageFailed;
  return (
    <motion.div
      className="bg-gray-900 border-2 border-green-400 shadow-[0_0_15px_#22c55e] p-6 w-full max-w-2xl mx-auto my-8 rounded-lg font-mono relative z-10"
      whileHover={{ scale: 1.02, boxShadow: "0 0 25px #22c55e" }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Image */}
      {shouldShowImage ? (
        <img
          src={imageSrc}
          alt={post.title || "Project image"}
          className="w-full h-64 object-cover mb-6 border border-green-500 rounded-lg"
          onError={() => {
            console.warn("Image failed to load:", { imageSrc, rawImage, postId: post?.id, title: post?.title });
            setImageFailed(true);
          }}
        />
      ) : (
        <div className="w-full h-64 bg-gray-800 mb-6 flex items-center justify-center text-green-400 text-lg border border-green-500 rounded-lg">
          [ IMAGE NOT PROVIDED ]
        </div>
      )}

      {/* Title + Description */}
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-green-400 text-center tracking-wider">
        {post.title}
      </h2>

      {/* Description Card */}
      <div className="mb-6 w-full max-w-2xl mx-auto text-gray-300 bg-black/30 rounded-lg border border-green-800/40 p-4 text-center">
        <p className="text-sm leading-relaxed">{post.description}</p>
      </div>

      {/* Divider */}
      <div className="h-px w-24 bg-green-500/40 mx-auto mb-6 shadow-[0_0_10px_#22c55e]" />

      {/* Author (left-aligned, subtle) */}
      <div className="mb-4 w-full text-center">
        <p className="text-sm text-green-300/90">{post.author?.username || post.user || "Unknown"}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {post.category && (
          <span className="px-3 py-1 text-xs uppercase tracking-wider rounded-full border border-green-500 text-green-300 bg-green-500/10 shadow-[0_0_8px_#22c55e]">
            {post.category}
          </span>
        )}
        {post.stack && (
          <span className="px-3 py-1 text-xs uppercase tracking-wider rounded-full border border-green-500 text-green-300 bg-green-500/10 shadow-[0_0_8px_#22c55e]">
            {post.stack}
          </span>
        )}
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
import React, { useState, useEffect } from "react";
import Post from "./Post";
import { swipePost } from "./api";
import { leftSwipePost } from "./leftSwipeApi";
import { useAppContext } from "../../AppContext";
import axios from "axios";
import { sendMessage } from "../Chat/api";

const Feed = ({ onRightSwipe, onLeftSwipe }) => {
  const [posts, setPosts] = useState([]);
  const [index, setIndex] = useState(0);
  const [leftSwiped, setLeftSwiped] = useState([]);
  const { addRightSwipedPost, CURRENT_USER } = useAppContext();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:9091/api/posts/feed?userId=${CURRENT_USER.id}`);
        setPosts(res.data);
      } catch (err) {
        setPosts([]);
      }
    };
    if (CURRENT_USER && CURRENT_USER.id) {
      fetchPosts();
    }
  }, [CURRENT_USER]);

  const visiblePosts = posts.filter((p) => !leftSwiped.includes(p.id));
  const currentPost = visiblePosts[index] || null;

  // Ensure index is always valid after left swipe
  useEffect(() => {
    if (index >= visiblePosts.length) {
      setIndex(Math.max(visiblePosts.length - 1, 0));
    }
  }, [leftSwiped, posts]);

  const handleRightSwipe = async () => {
    if (!currentPost) return;

    const swipeTime = new Date().toISOString();
    addRightSwipedPost({ ...currentPost, swipedAt: swipeTime });

    try {
      await swipePost({
        postId: currentPost.id,
        userId: CURRENT_USER.id,
        direction: "RIGHT",
        swipedAt: swipeTime
      });

      if (currentPost.author && currentPost.author.username) {
        const messageContent = `👋 Hey ${currentPost.author.username},  
I just right-swiped on your post **"${currentPost.title}"**.  

I’d love to collaborate with you on this! 🚀`;

        await sendMessage({
          sender: CURRENT_USER.username,
          content: messageContent,
          recipient: currentPost.author.username,
          timestamp: swipeTime
        });
      }
    } catch (err) {
      console.error("Failed to save right swipe or send message:", err);
    }

    if (onRightSwipe) onRightSwipe(currentPost, CURRENT_USER);
    setPosts(prev => prev.filter((p) => p.id !== currentPost.id));
  };

  const handleLeftSwipe = async () => {
    if (!currentPost) return;

    setLeftSwiped(prev => [...prev, currentPost.id]);

    try {
      await leftSwipePost({
        postId: currentPost.id,
        userId: CURRENT_USER.id,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to save left swipe:", err);
    }

    if (onLeftSwipe) onLeftSwipe(currentPost, CURRENT_USER);
  };

  const goToNext = () => {
    if (index < visiblePosts.length - 1) setIndex(index + 1);
  };

  const goToPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-black">
      <div className="flex-1 flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-[70%]">
          {currentPost ? (
            <Post
              post={currentPost}
              onRightSwipe={handleRightSwipe}
              onLeftSwipe={() => { handleLeftSwipe(); goToPrev(); }}
            />
          ) : (
            <div className="text-center text-gray-400 text-xl py-20">No more posts to show.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
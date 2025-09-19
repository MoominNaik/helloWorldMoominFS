// Feed.js (Matrix background fixed)
import React, { useState, useEffect, useRef } from "react";
import Post from "./Post";
import { swipePost } from "./api";
import { leftSwipePost } from "./leftSwipeApi";
import { useAppContext } from "../../AppContext";
import axios from "axios";
import { sendMessage } from "../Chat/api";
import { motion, AnimatePresence } from "framer-motion";

const Feed = ({ onRightSwipe, onLeftSwipe }) => {
  const [posts, setPosts] = useState([]);
  const [index, setIndex] = useState(0);
  const [leftSwiped, setLeftSwiped] = useState([]);
  const [direction, setDirection] = useState(0);
  const { addRightSwipedPost, CURRENT_USER } = useAppContext();
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9091/api/posts/feed?userId=${CURRENT_USER.id}`
        );
        setPosts(res.data);
      } catch {
        setPosts([]);
      }
    };
    if (CURRENT_USER && CURRENT_USER.id) fetchPosts();
  }, [CURRENT_USER]);

  const visiblePosts = posts.filter((p) => !leftSwiped.includes(p.id));
  const currentPost = visiblePosts[index] || null;

  // ---------- Matrix Background ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%".split("");
    let fontSize = 16;
    let columns;
    let drops = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(0);
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const draw = () => {
      // Clear with a slightly transparent black to create trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text color and style
      ctx.fillStyle = "#22c55e"; // Brighter green for better visibility
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.shadowColor = "#22c55e";
      ctx.shadowBlur = 5;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // ---------- Swipe Handlers ----------
  const handleRightSwipe = async () => {
    if (!currentPost) return;
    const swipeTime = new Date().toISOString();
    setDirection(1);
    addRightSwipedPost({ ...currentPost, swipedAt: swipeTime });

    try {
      await swipePost({
        postId: currentPost.id,
        userId: CURRENT_USER.id,
        direction: "RIGHT",
        swipedAt: swipeTime,
      });

      if (currentPost.author?.username) {
        await sendMessage({
          sender: CURRENT_USER.username,
          content: `🤖 Hey ${currentPost.author.username}, I right-swiped on your post "${currentPost.title}". Let's collaborate! 🚀`,
          recipient: currentPost.author.username,
          timestamp: swipeTime,
        });
      }
    } catch (err) {
      console.error("Failed to save right swipe or send message:", err);
    }

    if (onRightSwipe) onRightSwipe(currentPost, CURRENT_USER);
    goToNext();
  };

  const handleLeftSwipe = async () => {
    if (!currentPost) return;
    setDirection(-1);
    setLeftSwiped((prev) => [...prev, currentPost.id]);
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
    goToNext();
  };

  function goToNext() {
    setTimeout(() => {
      if (index < visiblePosts.length - 1) setIndex(index + 1);
      else setIndex(0);
    }, 400);
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* Matrix Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full opacity-30"
        style={{ zIndex: 1 }}
      />

      <div className="relative z-10 w-full max-w-2xl h-auto">
        <AnimatePresence mode="wait" custom={direction}>
          {currentPost ? (
            <motion.div
              key={currentPost.id}
              custom={direction}
              variants={{
                enter: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir) => ({ x: dir > 0 ? 400 : -400, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
                <Post
                  post={currentPost}
                  onRightSwipe={handleRightSwipe}
                  onLeftSwipe={handleLeftSwipe}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="w-full bg-gray-900 border-2 border-green-400 shadow-[0_0_15px_#22c55e] p-6 rounded-lg text-center text-green-400 text-xl relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ⚡ No more posts to show.
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;
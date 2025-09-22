// Feed.js (Matrix background fixed)
import React, { useState, useEffect } from "react";
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
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addRightSwipedPost, CURRENT_USER } = useAppContext();

  // Helper to compare arrays by value
  const arraysEqual = (a = [], b = []) => {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  // Fetch posts whenever user or selected categories change
  useEffect(() => {
    const fetchPosts = async () => {
      if (!CURRENT_USER || !CURRENT_USER.id) return;
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.set("userId", CURRENT_USER.id);
        if (selectedCategories && selectedCategories.length > 0) {
          // backend supports comma-separated or repeated params; we'll send comma-separated
          params.set("categories", selectedCategories.join(","));
        }
        const url = `http://localhost:9091/api/posts/feed?${params.toString()}`;
        const res = await axios.get(url);
        setPosts(res.data || []);
        // We don't set categories here; categories should reflect only currently visible posts
      } catch (e) {
        console.error("Failed to fetch posts:", e);
        setError("Failed to load feed");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [CURRENT_USER, selectedCategories]);

  const visiblePosts = posts.filter((p) => !leftSwiped.includes(p.id));
  const currentPost = visiblePosts[index] || null;

  // Recompute available categories based on currently visible posts
  useEffect(() => {
    const cats = Array.from(
      new Set(visiblePosts.map((p) => (p.category || "").trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    // Only update if changed to avoid triggering dependent effects unnecessarily
    if (!arraysEqual(allCategories, cats)) {
      setAllCategories(cats);
    }
    // Clean any selected categories that are no longer available
    setSelectedCategories((prev) => {
      const cleaned = prev.filter((c) => cats.includes(c));
      return arraysEqual(prev, cleaned) ? prev : cleaned;
    });
    // Reset index if no more visible posts in current selection
    if (!currentPost && visiblePosts.length > 0) {
      setIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, leftSwiped]);

  // Matrix background is handled by Home.js. Feed contains only content and animations.

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
    <div className="relative w-full">
      <div className="relative w-full max-w-2xl h-auto">
        {/* Category Filters */}
        <div className="w-full mx-auto max-w-xl mb-4 p-4 rounded-lg bg-gray-900/70 border border-green-500/40 text-green-300 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs">
              {loading ? <span className="opacity-80">Loading...</span> : null}
              {error ? <span className="text-red-400">{error}</span> : null}
            </div>
          </div>
          {allCategories.length === 0 ? (
            <p className="text-xs opacity-80">No categories discovered yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2 w-full max-w-xl mx-auto justify-center">
              {allCategories.map((cat) => {
                const checked = selectedCategories.includes(cat);
                return (
                  <motion.button
                    key={cat}
                    type="button"
                    aria-pressed={checked}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 12px #22c55e" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIndex(0);
                      setSelectedCategories((prev) =>
                        checked ? prev.filter((c) => c !== cat) : [...prev, cat]
                      );
                    }}
                    className={`
                      px-3 py-1 rounded-full text-xs tracking-wider transition-all duration-150
                      border shadow-[0_0_8px_rgba(34,197,94,0.35)]
                      ${
                        checked
                          ? "bg-green-500/20 border-green-400 text-green-100 ring-1 ring-green-400/60"
                          : "bg-gray-900/60 border-green-700/40 text-green-300 hover:bg-green-500/10"
                      }
                    `}
                    style={{ backdropFilter: "blur(2px)" }}
                  >
                    <span className="opacity-90">#</span> {cat}
                  </motion.button>
                );
              })}
              {selectedCategories.length > 0 && (
                <button
                  className="ml-2 px-3 py-1 text-xs rounded bg-transparent border border-red-500/70 text-red-300 hover:bg-red-600/20 shadow-[0_0_8px_rgba(239,68,68,0.35)]"
                  onClick={() => {
                    setIndex(0);
                    setSelectedCategories([]);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
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
              className="w-full relative"
              style={{ willChange: "transform, opacity", zIndex: 2 }}
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
                style={{ zIndex: 2 }}
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
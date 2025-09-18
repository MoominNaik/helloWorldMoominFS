import React from "react";
import Feed from "../Components/Feed/Feed";
import { useAppContext } from "../AppContext";

const Home = () => {
  const { addRightSwipedPost, addContributionMessage, CURRENT_USER } = useAppContext();

  // Handler for right swipe
  const handleRightSwipe = (post) => {
    addRightSwipedPost(post);
    addContributionMessage(post, CURRENT_USER);
  };

  // Handler for left swipe (can be extended for backend)
  const handleLeftSwipe = (post) => {
    // No-op for now, but could call backend
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Feed takes all available space */}
      <div className="flex-1 overflow-y-auto">
        <Feed onRightSwipe={handleRightSwipe} onLeftSwipe={handleLeftSwipe} />
      </div>
    </div>
  );
};

export default Home;
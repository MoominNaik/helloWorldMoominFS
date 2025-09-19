import React, { useEffect, useRef } from "react";
import Feed from "../Components/Feed/Feed";
import { useAppContext } from "../AppContext";

const Home = () => {
  const { addRightSwipedPost, addContributionMessage, CURRENT_USER } = useAppContext();
  const canvasRef = useRef(null);

  // Matrix animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%".split("");
    let fontSize = 16;
    let columns;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drops = Array(columns).fill(0);

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
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Swipe handlers
  const handleRightSwipe = (post) => {
    addRightSwipedPost(post);
    addContributionMessage(post, CURRENT_USER);
  };

  const handleLeftSwipe = (post) => {
    // Can extend backend functionality if needed
  };

  return (
    <div className="relative w-full min-h-screen bg-black flex items-center justify-center p-0">
      {/* Canvas for Matrix animation with fixed positioning */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full opacity-30"
        style={{ zIndex: 1 }}
      />
      
      {/* Feed content above animation */}
      <div className="relative z-10 w-full max-w-2xl">
        <Feed onRightSwipe={handleRightSwipe} onLeftSwipe={handleLeftSwipe} />
      </div>
    </div>
  );
};

export default Home;
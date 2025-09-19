import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Search,
  PlusCircle,
  User,
  MessageCircle,
  Heart,
  LogOut,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../AuthContext";

const navItems = [
  { icon: Search, label: "Search", path: "/search" },
  { icon: PlusCircle, label: "Post Project", path: "/post-project" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: Heart, label: "Right Swiped", path: "/right-swiped" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full bg-gray-900 text-green-400 font-mono w-80 fixed right-0 top-0 bottom-0 z-10">
      {/* Logo */}
      <Link to="/" className="mb-10">
        <motion.h1
          className="text-4xl font-bold tracking-wide text-center" // Slightly bigger
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 8px #22c55e, 0 0 12px #22c55e",
          }}
        >
          helloWorld
        </motion.h1>
      </Link>

      {/* Navigation Items */}
      <nav className="flex flex-col items-center space-y-3 w-full">
        {navItems.map((item) => {
          const isActive = activeItem.startsWith(item.path);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              className="relative w-full flex justify-center"
              whileHover={{
                scale: 1.08,
              }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={item.path}
                className={`flex items-center justify-center space-x-2 px-4 py-2 w-44 text-sm whitespace-nowrap transition-all duration-200 ${
                  isActive ? "text-green-300" : "text-green-500"
                }`}
              >
                <Icon size={16} />
                <motion.span
                  whileHover={{
                    textShadow: "0 0 8px #22c55e, 0 0 12px #22c55e",
                  }}
                >
                  {item.label}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout Button */}
      {user && (
        <motion.button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 px-4 py-2 mt-10 w-44 text-sm whitespace-nowrap text-red-400 hover:text-red-300 font-mono"
          whileHover={{
            opacity: [1, 0.6, 1],
            transition: { duration: 0.4, repeat: Infinity },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </motion.button>
      )}
    </div>
  );
};

export default Navbar;
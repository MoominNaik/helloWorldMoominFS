import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { User, Users, UserPlus, MessageCircle, Heart } from "lucide-react";
import { useAuth } from "../../AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Logo / Brand */}
        <Link to="/" className="block w-full">
          <h1 className="text-3xl font-extrabold text-green-400 tracking-wide border-b border-gray-800 pb-3 w-full text-center cursor-pointer hover:text-green-300 transition">
            helloWorld
          </h1>
        </Link>

        {/* Menu */}
        <ul className="flex flex-col w-full space-y-4 text-gray-400 font-medium">
          <li>
            <button
              onClick={() => navigate("/search")}
              className="flex items-center justify-center space-x-3 hover:text-green-400 cursor-pointer transition w-full py-2"
            >
              <Search size={18} className="mr-2" />
              <span>Search</span>
            </button>
          </li>
          <li>
            <Link
              to="/post-project"
              className="flex items-center justify-center space-x-3 hover:text-green-400 cursor-pointer transition"
            >
              <span className="font-bold text-lg">+</span>
              <span>Post Project</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center justify-center space-x-3 hover:text-green-400 cursor-pointer transition"
            >
              <User size={18} className="mr-2" />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className="flex items-center justify-center space-x-3 hover:text-green-400 cursor-pointer transition"
            >
              <MessageCircle size={18} className="mr-2" />
              <span>Chat</span>
            </Link>
          </li>
          <li>
            <Link
              to="/right-swiped"
              className="flex items-center justify-center space-x-3 hover:text-green-400 cursor-pointer transition"
            >
              <Heart size={18} className="mr-2" />
              <span>Right Swiped</span>
            </Link>
          </li>
        </ul>
      </div>
      {user && (
        <button
          onClick={logout}
          className="w-full py-3 bg-transparent hover:bg-gray-900 border-t border-gray-800 text-red-500 font-bold text-lg transition"
          style={{ borderRadius: 0 }}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
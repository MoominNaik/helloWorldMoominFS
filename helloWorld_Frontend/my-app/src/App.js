import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

// Pages
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Chat from './Pages/Chat';
import RightSwiped from './Pages/RightSwiped';
import PostProject from './Pages/PostProject';
import SearchPage from './Pages/SearchPage';
import PublicProfile from './Pages/PublicProfile';
import DebugProfile from './Pages/DebugProfile';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

// Components
import Navbar from './Components/Navbar/Navbar';

// Contexts
import { AppProvider } from './AppContext';
import { AuthProvider, useAuth } from './AuthContext';
import { ChatProvider } from './Components/Chat/ChatContext';

// Styles
import './index.css';
//import Footer from './Components/Footer/Footer.js';

function MainApp() {
  return (
    <AppProvider>
      <ChatProvider>
        <BrowserRouter>
          <div className="flex h-screen bg-black">
            {/* Main Content */}
            <div className="flex-1 h-full overflow-y-auto">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/right-swiped" element={<RightSwiped />} />
                <Route path="/post-project" element={<PostProject />} />
                <Route path="/search" element={<SearchPage />} />
                
                {/* Profile Routes */}
                <Route path="/public-profile/:email" element={<PublicProfile />} />
                <Route path="/debug-profile/:email" element={<DebugProfile />} />
                
                {/* 404 Route - Keep this last */}
                <Route path="*" element={
                  <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold mb-4">404</h1>
                      <p className="text-xl">Page not found</p>
                      <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
                        Go back home
                      </Link>
                    </div>
                  </div>
                } />
              </Routes>
            </div>
            {/* Sidebar Navbar on the right */}
            <div className="w-64 border-l border-gray-800 bg-black h-full">
              <Navbar />
            </div>
          </div>
        </BrowserRouter>
      </ChatProvider>
    </AppProvider>
  );
}

function App() {
  const { user } = useAuth();
  const [showSignup, setShowSignup] = React.useState(false);

  if (!user) {
    return showSignup ? (
      <Signup onSwitch={() => setShowSignup(false)} />
    ) : (
      <Login onSwitch={() => setShowSignup(true)} />
    );
  }
  return <MainApp />;
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
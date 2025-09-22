import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation, Link } from 'react-router-dom';

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


function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      {children}
    </div>
  );
}

function MainContent() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const hideNavbar = !user || location.pathname === '/login' || location.pathname === '/signup';

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-green-400 text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated and not on auth pages
  if (!user && location.pathname !== '/login' && location.pathname !== '/signup') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if authenticated and on auth pages
  if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Main Content */}
      <div className={`flex-1 h-full overflow-y-auto ${!hideNavbar ? 'pr-80' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <AuthLayout>
                  <Signup />
                </AuthLayout>
              } 
            />

            {/* Protected Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:username" element={<Chat />} />
            <Route path="/right-swiped" element={<RightSwiped />} />
            <Route path="/post-project" element={<PostProject />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/public-profile/:username" element={<PublicProfile />} />
            <Route path="/debug-profile/:username" element={<DebugProfile />} />

            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-xl">Page not found</p>
                  <Link to="/" className="text-green-400 hover:underline mt-4 inline-block">
                    Go to Home
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>

      {/* Sidebar Navbar */}
      {!hideNavbar && (
        <div className="w-80 fixed right-0 top-0 bottom-0 border-l border-gray-800 bg-gray-900 h-full z-10">
          <Navbar />
        </div>
      )}
    </div>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ChatProvider>
            <Routes>
              <Route path="/*" element={<MainContent />} />
            </Routes>
          </ChatProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';


import Home from './Pages/Home';
import './index.css';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Pages/Profile.js';
import Chat from './Pages/Chat';
import RightSwiped from './Pages/RightSwiped';
import PostProject from './Pages/PostProject';
import SearchPage from './Components/Pages/SearchPage';
import PublicProfile from './Components/Pages/PublicProfile';
import { AppProvider } from './AppContext';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Components/Pages/Login';
import Signup from './Components/Pages/Signup';
//import Footer from './Components/Footer/Footer.js';



function MainApp() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-black">
          {/* Main Content */}
          <div className="flex-1 h-full overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/right-swiped" element={<RightSwiped />} />
              <Route path="/post-project" element={<PostProject />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/public-profile/:id" element={<PublicProfile />} />
            </Routes>
          </div>
          {/* Sidebar Navbar on the right */}
          <div className="w-64 border-l border-gray-800 bg-black h-full">
            <Navbar />
          </div>
        </div>
      </BrowserRouter>
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
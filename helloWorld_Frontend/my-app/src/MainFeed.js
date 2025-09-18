import React from 'react';
import './MainFeed.css';
import Feed from './Feed';
import Navbar from './Navbar';

const MainFeed = () => {
  return (
    <div className="main-feed-container">
      <div className="feed-section">
        <Feed />
      </div>
      <div className="navbar-section">
        <Navbar />
      </div>
    </div>
  );
};

export default MainFeed;

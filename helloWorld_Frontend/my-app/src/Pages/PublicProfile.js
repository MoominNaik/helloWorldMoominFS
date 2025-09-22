import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserProfile } from '../Components/Feed/api';

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);

  const formatName = (user) => {
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.username?.split('@')[0] || 'User';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await getUserProfile(username);
        if (!profileData) throw new Error('No profile data received');
        setProfile(profileData);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  // Fetch user's posts when profile (with id) is available
  useEffect(() => {
    const fetchPosts = async () => {
      if (!profile || !profile.id) return;
      try {
        const res = await axios.get(`http://localhost:9091/api/posts/user/${profile.id}`);
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setPosts([]);
      }
    };
    fetchPosts();
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-md h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center p-6 max-w-sm mx-auto bg-gray-900 rounded-lg shadow-[0_0_10px_0_#00FF7F]">
          <h2 className="text-xl font-bold text-green-400 mb-2">Error Loading Profile</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-mono rounded transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center p-6 max-w-sm mx-auto bg-gray-900 rounded-lg shadow-[0_0_10px_0_#00FF7F]">
          <h2 className="text-xl font-bold text-green-400 mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-6">The requested profile could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-mono rounded transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const displayName = formatName(profile);
  const initials = getInitials(displayName);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 md:p-10 bg-black font-mono text-green-400">
      {/* Profile Section (mirrors Profile.js) */}
      <div className="w-full max-w-7xl mb-16 px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-start w-full space-y-10 md:space-y-0 pb-8 border-b-2 border-gray-900">
          {/* Profile Picture */}
          <div className="w-40 h-40 rounded bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center text-white text-lg shadow-2xl overflow-hidden mr-12">
            {profile.profilePicUrl ? (
              <img
                src={`http://localhost:9091${profile.profilePicUrl}`}
                alt="Profile"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              initials
            )}
          </div>

          {/* User Info + Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start w-full md:pl-12">
            {/* Left: Info */}
            <div className="flex flex-col items-start w-full max-w-3xl space-y-4">
              <h1 className="text-4xl font-bold">{displayName}</h1>
              <p className="text-gray-300">{profile.email}</p>
              <p className="text-gray-400">{profile.designation}</p>
              <p className="text-gray-400">{profile.bio}</p>

              {/* Posts Count */}
              <div className="flex space-x-8 mt-4">
                <div className="flex flex-col items-center">
                  <p className="text-xl font-bold text-green-400">{posts.length}</p>
                  <p className="text-gray-400">Posts</p>
                </div>
              </div>
            </div>

            {/* Right: Chat Action */}
            <div className="w-full md:w-auto mt-4 md:mt-0 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/chat/${encodeURIComponent(profile.username)}`)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded-sm shadow-[0_0_8px_0_#00FF7F] transition"
                title={`Chat with ${displayName}`}
              >
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section (mirrors Profile.js cards) */}
      <div className="w-full max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-green-400 mb-8 text-center">Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {posts.length === 0 && (
            <div className="text-gray-400 col-span-full text-center text-lg">No posts yet.</div>
          )}
          {posts.map((post, idx) => (
            <div
              key={post.id || post.title + idx}
              className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-700 hover:shadow-green-500/40 transition-all cursor-pointer w-full"
            >
              <div className="w-full h-52 bg-gradient-to-r from-green-500/20 to-teal-400/20 rounded-lg mb-4 flex items-center justify-center text-gray-400 overflow-hidden">
                {post.pimage || post.image ? (
                  <img
                    src={`http://localhost:9091${post.pimage || post.image}`}
                    alt={post.pname || post.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span>Image</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-green-300 mb-1">{post.pname || post.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{post.pdescription || post.description}</p>
              <div className="text-xs text-green-400 mb-1">Stack: {post.pStack || post.stack}</div>
              <div className="text-xs text-green-400">Category: {post.pCategory || post.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
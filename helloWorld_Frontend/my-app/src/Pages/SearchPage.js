import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchUsers, createChat } from "../Components/Feed/api";

const ProfileCard = ({ profile }) => (
  <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg flex flex-col items-center hover:border-green-400 transition">
    <Link to={`/public-profile/${profile.username}`} className="flex flex-col items-center space-y-2">
      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-lg shadow-lg mb-4 mx-auto">
        {profile.profilePicUrl ? (
          <img 
            src={`http://localhost:9091${profile.profilePicUrl}`} 
            alt={profile.username} 
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.firstName || profile.username)}&background=random`;
            }}
          />
        ) : (
          <span>{profile.firstName ? profile.firstName[0] : profile.username[0]}</span>
        )}
      </div>
      <h1 className="text-2xl font-bold text-white mb-1">
        {profile.firstName} {profile.lastName}
      </h1>
      <p className="text-green-400 font-medium mb-2">{profile.designation || 'No title'}</p>
      <p className="text-gray-300 text-center">{profile.bio || 'No bio available'}</p>
    </Link>
  </div>
);

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setProfiles([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await searchUsers(query);
        setProfiles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search users. Please try again.');
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    const timerId = setTimeout(search, 500);
    return () => clearTimeout(timerId);
  }, [query]);

  return (
    <div className="min-h-screen bg-black p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search users by name, username, or title..."
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className="text-center text-gray-400 my-8">
            {query ? 'Searching...' : 'Loading profiles...'}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center my-4">{error}</div>
        )}

        {!loading && !error && query && profiles.length === 0 && (
          <div className="text-gray-400 text-center my-8">No users found matching "{query}"</div>
        )}

        {!loading && !error && !query && (
          <div className="text-gray-400 text-center my-12">
            <h2 className="text-2xl font-bold mb-4">Search for Users</h2>
            <p>Enter a name, username, or title in the search bar above to find users.</p>
          </div>
        )}

        {!loading && !error && query && profiles.length === 0 && (
          <div className="text-gray-400 text-center my-8">No users found matching "{query}"</div>
        )}

        {profiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard 
                key={profile.username} 
                profile={profile} 
                />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchUsers } from "../Components/Feed/api";

const ProfileCard = ({ profile }) => {
  const username = profile?.username || "user";
  const firstName = profile?.firstName || "";
  const lastName = profile?.lastName || "";
  const fullName = (firstName + " " + lastName).trim() || username;
  const designation = profile?.designation || "—";
  const bio = profile?.bio || "No bio available";
  const profilePicUrl = profile?.profilePicUrl;

  // For search results, backend returns User entity (no profilePicUrl),
  // but profile pics are served at /api/profile/{username}/profile-pic when present.
  // Use that endpoint and gracefully fallback to ui-avatars if it 404s.
  const backendAvatar = `http://localhost:9091/api/profile/${encodeURIComponent(username)}/profile-pic`;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;
  const resolvedAvatar = profilePicUrl
    ? `http://localhost:9091${profilePicUrl}`
    : backendAvatar;

  return (
    <div className="bg-gray-900/90 border border-green-700/40 p-6 rounded-lg shadow-[0_0_8px_rgba(34,197,94,0.35)] hover:shadow-[0_0_16px_rgba(34,197,94,0.55)] transition-all duration-200 font-mono">
      <Link to={`/public-profile/${username}`} className="flex flex-col items-center space-y-3">
        <div className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center text-white text-lg border border-green-700/50 shadow-[0_0_5px_0_#00FF7F] mx-auto overflow-hidden">
          <img
            src={resolvedAvatar}
            alt={username}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackAvatar;
            }}
          />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-green-400 mb-1">{fullName}</h1>
          <p className="text-green-300/80 text-sm mb-1">@{username}</p>
          <p className="text-blue-300 text-sm mb-2 min-h-5">{designation}</p>
          <p className="text-gray-300 text-sm line-clamp-3 max-w-xs">{bio}</p>
        </div>
      </Link>
    </div>
  );
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-black p-4 md:p-10 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name, username, or title..."
              className="w-full px-4 py-3 rounded-md bg-gray-900 text-white border border-green-700/40 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg shadow-[0_0_6px_rgba(34,197,94,0.35)] pr-12"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-gray-800 border border-green-700/40 text-green-300 rounded hover:bg-gray-700"
              >
                Clear
              </button>
            )}
          </div>
          {query && !loading && (
            <div className="mt-2 text-sm text-green-300/80">
              {profiles.length} result{profiles.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {loading && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse bg-gray-900/70 border border-green-700/30 rounded-lg p-6"
                >
                  <div className="w-28 h-28 rounded-full bg-gray-800 mx-auto mb-4" />
                  <div className="h-4 bg-gray-800 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-1/2 mx-auto mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-5/6 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center my-4">{error}</div>
        )}

        {!loading && !error && !query && (
          <div className="text-gray-400 text-center my-12">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Search for Users</h2>
            <p>Enter a name, username, or title in the search bar above to find users.</p>
          </div>
        )}

        {!loading && !error && query && profiles.length === 0 && (
          <div className="text-gray-400 text-center my-12">
            <div className="text-6xl mb-4">🔍</div>
            <div>No users found matching "{query}"</div>
          </div>
        )}

        {profiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <ProfileCard key={profile.username} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
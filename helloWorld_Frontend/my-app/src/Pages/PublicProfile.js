import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../Components/Feed/api';

const PublicProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        const profileData = await getUserProfile(email);
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
  }, [email]);

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
    <div className="min-h-screen bg-black font-mono text-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md bg-black/20 hover:bg-green-500/20 transition"
          >
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-green-400">{displayName}</h1>
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-300 font-bold">
            {initials}
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 -mt-16">
        <div className="flex items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-4xl font-bold text-green-300 mr-6 shadow-[0_0_10px_0_#00FF7F]">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-400">{displayName}</h1>
            {profile.designation && (
              <p className="text-blue-400 text-lg">{profile.designation}</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-900 rounded-lg shadow-[0_0_10px_0_#00FF7F] overflow-hidden border border-gray-700 p-6">
          {profile.bio && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-400 mb-2">About</h2>
              <p className="text-gray-400 whitespace-pre-line">{profile.bio}</p>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded shadow-[0_0_5px_0_#00FF7F] border border-gray-700">
                <p className="text-sm font-medium text-gray-400 mb-1">Email</p>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-blue-400 hover:text-green-400 hover:underline break-all transition"
                >
                  {profile.email}
                </a>
              </div>
              {profile.phoneNumber && (
                <div className="bg-gray-800 p-4 rounded shadow-[0_0_5px_0_#00FF7F] border border-gray-700">
                  <p className="text-sm font-medium text-gray-400 mb-1">Phone</p>
                  <a
                    href={`tel:${profile.phoneNumber}`}
                    className="text-blue-400 hover:text-green-400 hover:underline transition"
                  >
                    {profile.phoneNumber}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
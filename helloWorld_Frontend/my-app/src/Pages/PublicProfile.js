import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { getUserProfile } from '../Components/Feed/api';

// Simple debug logger
const debug = {
  log: (message, data) => console.log(`[LOG] ${new Date().toISOString()} - ${message}`, data || ''),
  error: (message, error) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || ''),
  warn: (message, data) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || ''),
  info: (message, data) => console.info(`[INFO] ${new Date().toISOString()} - ${message}`, data || ''),
  api: (message, data) => console.log(`[API] ${new Date().toISOString()} - ${message}`, data || '')
};

const PublicProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Log initial state
  debug.log('Component initialized with email:', email);
  debug.log('Auth state:', {
    token: localStorage.getItem('token'),
    currentUser: localStorage.getItem('username')
  });

  // Format name with fallback
  const formatName = (user) => {
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.username?.split('@')[0] || 'User';
  };
  
  // Get initials for avatar
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
      debug.log('Fetching profile for email:', email);
      try {
        const startTime = performance.now();
        const profileData = await getUserProfile(email);
        const requestTime = performance.now() - startTime;
        
        debug.api(`API call completed in ${requestTime.toFixed(2)}ms`);
        debug.log('API response:', profileData);
        
        if (!profileData) {
          throw new Error('No profile data received');
        }
        
        setProfile(profileData);
        setError('');
      } catch (err) {
        const errorDetails = {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        };
        
        debug.error('Error fetching profile:', errorDetails);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
    
    return () => {
      debug.log('Component unmounting or updating', { email });
    };
  }, [email]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The requested profile could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-full bg-black/10 hover:bg-green-500/20 text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-300 font-bold">
              {initials}
            </div>
          </div>
          
          {/* Profile Header */}
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-4xl font-bold text-green-300 mr-6">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
              {profile.designation && (
                <p className="text-green-200 text-lg">{profile.designation}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            {/* About Section */}
            {profile.bio && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">About</h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{profile.bio}</p>
              </div>
            )}
            
            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <a 
                    href={`mailto:${profile.email}`}
                    className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 hover:underline break-all transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
                {profile.phoneNumber && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                    <a 
                      href={`tel:${profile.phoneNumber}`}
                      className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 hover:underline transition-colors"
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
    </div>
  );
};

export default PublicProfile;

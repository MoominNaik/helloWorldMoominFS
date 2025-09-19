import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../Components/Feed/api';

// Simple debug logger
const log = {
  info: (message, data) => console.log(`[${new Date().toISOString()}] INFO: ${message}`, data || ''),
  error: (message, error) => console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error || '')
};

const DebugProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Log initial state
  useEffect(() => {
    log.info('Component mounted', { username });
    log.info('Auth state', {
      hasToken: !!localStorage.getItem('token'),
      currentUser: localStorage.getItem('username')
    });

    const fetchProfile = async () => {
      if (!username) {
        const msg = 'No username in URL';
        log.error(msg);
        setError(msg);
        setLoading(false);
        return;
      }

      try {
        log.info('Fetching profile...');
        const startTime = Date.now();
        
        const data = await getUserProfile(username);
        
        log.info(`Profile received in ${Date.now() - startTime}ms`, data);
        
        if (!data) {
          throw new Error('No data received');
        }
        
        setProfile(data);
        setError('');
      } catch (err) {
        log.error('Failed to load profile', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
        
        let errorMsg = 'Failed to load profile';
        if (err.message.includes('401')) {
          errorMsg = 'Please log in again';
          navigate('/login');
        } else if (err.message.includes('404')) {
          errorMsg = 'User not found';
        }
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, navigate]);

  // Log state changes
  useEffect(() => {
    log.info('State updated', { loading, error, hasProfile: !!profile });
  }, [loading, error, profile]);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h2>Loading profile...</h2>
        <p>Checking console for debug logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h2 style={{ color: 'red' }}>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Debug Profile View</h2>
      <h3>Profile Data:</h3>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      <div style={{ marginTop: '20px' }}>
        <h3>Debug Info:</h3>
        <p>Username: {username}</p>
        <p>Has Token: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
        <p>Current User: {localStorage.getItem('username') || 'None'}</p>
      </div>
    </div>
  );
};

export default DebugProfile;

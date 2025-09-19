import axios from "axios";

const API_BASE_URL = "http://localhost:9091"; // Backend API base URL

export const swipePost = async ({ postId, userId, direction, timestamp }) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  return axios.post(
    `${API_BASE_URL}/api/swipes?userId=${userId}&postId=${postId}&direction=${direction}`,
    null, // No body needed
    { headers }
  );
};

export const getRightSwipedPosts = async (userId) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  return axios.get(
    `${API_BASE_URL}/api/swipes/inbox?userId=${userId}`,
    { headers }
  );
};

// User Search API
export const searchUsers = async (query) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:9091/api/users/search?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

/**
 * Fetches a user's profile by username
 * @param {string} username - The username of the profile to fetch
 * @returns {Promise<Object>} The user profile data
 * @throws {Error} If there's an error fetching the profile
 */
export const getUserProfile = async (username) => {
  // Debug log the function call
  console.log('[API] Fetching profile for username:', username);
  
  // Get authentication details
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("username");
  
  // Debug authentication state
  console.log('[API] Auth state:', { 
    hasToken: !!token,
    currentUser: currentUser || 'Not logged in',
    tokenLength: token?.length || 0
  });
  
  // Public profiles don't require authentication
  if (!username) {
    throw new Error('Username is required to fetch profile');
  }
  
  try {
    // Construct the URL and log the request
    const url = `${API_BASE_URL}/api/profile/${encodeURIComponent(username)}`;
    console.log('[API] Making authenticated request to:', url);
    
    // Make the API request
    const startTime = performance.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      redirect: 'manual' // Prevent automatic redirects
    });
    
    // Calculate request duration
    const duration = (performance.now() - startTime).toFixed(2);
    console.log(`[API] Request completed in ${duration}ms`, {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      redirected: response.redirected,
      type: response.type
    });
    
    // Handle different response statuses
    if (response.redirected) {
      console.warn('[API] Request was redirected to:', response.url);
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    
    if (response.status === 401) {
      console.warn('[API] Authentication failed, clearing local storage');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
      throw new Error('Your session has expired. Please log in again.');
    }
    
    if (response.status === 404) {
      const errorText = await response.text();
      console.warn('[API] Profile not found:', errorText);
      throw new Error('The requested profile was not found');
    }
    
    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (e) {
        errorDetails = await response.text();
      }
      
      console.error('[API] API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorDetails,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const errorMessage = typeof errorDetails === 'object' 
        ? errorDetails.message || 'An unknown error occurred'
        : errorDetails || `Request failed with status ${response.status}`;
        
      throw new Error(errorMessage);
    }

    // Parse the successful response
    let responseData;
    try {
      responseData = await response.json();
      console.debug('[API] Response data:', responseData);
    } catch (parseError) {
      console.error('[API] Failed to parse JSON response:', parseError);
      throw new Error('Invalid response from server');
    }
    
    // Validate the response data
    if (!responseData || typeof responseData !== 'object') {
      console.error('[API] Invalid response format:', responseData);
      throw new Error('Invalid profile data received');
    }
    
    // Ensure required fields exist
    if (!responseData.username) {
      console.warn('[API] Incomplete profile data received:', responseData);
      // Continue anyway with the partial data
    }
    
    return responseData;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
};

// Add this function to create a new chat
export const createChat = async (sender, receiver) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch("http://localhost:9091/api/chat/start", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participants: [sender, receiver],
        initialMessage: {
          content: `Hi, I'd like to connect with you!`,
          sender: sender,
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (response.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }

    if (response.status === 409) {
      // Chat already exists, get the existing chat
      const existingChat = await response.json();
      return existingChat;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create chat');
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

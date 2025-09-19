import axios from 'axios';

const API_BASE_URL = 'http://localhost:9091'; // Backend API base URL

export const leftSwipePost = async ({ postId, userId, timestamp }) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  return axios.post(
    `${API_BASE_URL}/api/left-swipes`,
    { postId, userId, timestamp },
    { headers }
  );
};

export const getLeftSwipedPostIds = async (userId) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
  return axios.get(
    `${API_BASE_URL}/api/left-swipes/ids/${userId}`,
    { headers }
  );
};

import axios from 'axios';

const API_BASE_URL = 'http://localhost:9091'; // Use correct backend port

export const leftSwipePost = async ({ postId, userId, timestamp }) => {
  return axios.post(`${API_BASE_URL}/api/left-swipes`, {
    postId,
    userId,
    timestamp,
  });
};

export const getLeftSwipedPostIds = async (userId) => {
  return axios.get(`${API_BASE_URL}/api/left-swipes/ids/${userId}`);
};

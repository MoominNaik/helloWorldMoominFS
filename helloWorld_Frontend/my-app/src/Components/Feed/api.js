import axios from 'axios';

const API_BASE_URL = 'http://localhost:9091'; // Use correct backend port

export const swipePost = async ({ postId, userId, direction, timestamp }) => {
  return axios.post(
    `${API_BASE_URL}/api/swipes?userId=${userId}&postId=${postId}&direction=${direction}`,
    null // No body needed
  );
};

export const getRightSwipedPosts = async (userId) => {
  return axios.get(`${API_BASE_URL}/api/swipes/inbox?userId=${userId}`);
};

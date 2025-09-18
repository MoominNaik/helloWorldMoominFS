// src/Components/Chat/api.js
// Utility functions for chat API endpoints

const API_BASE = "http://localhost:9091/api/chat/messages";

/**
 * Get authorization headers if token exists
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

/**
 * Send a new chat message
 * @param {{sender: string, content: string}} message
 */
export async function sendMessage(message) {
  console.log("Sending message:", message);
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      sender: message.sender,
      recipient: message.recipient,
      content: message.content
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send message: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getAllMessages() {
  const res = await fetch(API_BASE, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch messages: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getMessageById(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch message by ID: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getMessagesBySender(sender) {
  // Use the new endpoint that returns all messages where user is sender or recipient
  const res = await fetch(`${API_BASE}/user/${encodeURIComponent(sender)}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch messages by user: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getRecentMessages(limit) {
  const res = await fetch(`${API_BASE}/recent/${limit}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch recent messages: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function searchMessages(keyword) {
  const res = await fetch(`${API_BASE}/search?keyword=${encodeURIComponent(keyword)}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to search messages: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function deleteMessage(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete message: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getMessagesBetweenUsers(user1, user2) {
  const res = await fetch(`${API_BASE}/between?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch messages between users: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getAllUsers() {
  const res = await fetch("http://localhost:9091/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// getMessagesAfter removed

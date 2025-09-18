// src/Components/Chat/usersApi.js
// Utility to fetch all users

const USERS_API = "http://localhost:9091/api/users";

export async function getAllUsers() {
  const res = await fetch(USERS_API);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

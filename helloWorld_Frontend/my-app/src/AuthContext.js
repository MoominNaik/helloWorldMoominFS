import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // <-- make this available to Profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:9091/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      setUser({ id: data.id, username: data.username, name: data.name, email: data.email, ...data });
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:9091/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      await login(email, password);
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const validateToken = async (token) => {
    try {
      const res = await fetch("http://localhost:9091/api/users/me", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ id: data.id, username: data.username, name: data.name, email: data.email, ...data });
        return true;
      } else {
        localStorage.removeItem("token");
        return false;
      }
    } catch {
      localStorage.removeItem("token");
      return false;
    }
  };

  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) await validateToken(token);
      setLoading(false);
    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
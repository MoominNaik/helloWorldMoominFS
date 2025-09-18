import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email }
  const [loading, setLoading] = useState(true); // Start with loading true to check for existing token
  const [error, setError] = useState(null);


  // Real login using backend API
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
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      setUser({
        id: data.id,
        username: data.username || data.name || data.email || "User",
        name: data.name || data.username || data.email || "User",
        email: data.email,
        ...data // in case backend returns more fields
      });
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };


  // Real signup using backend API
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
      // Auto-login after signup
      await login(email, password);
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Function to validate token and get user info
  const validateToken = async (token) => {
    try {
      console.log("Validating token:", token);
      const res = await fetch("http://localhost:9091/api/users/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log("Token validation response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Token validation successful, user data:", data);
        setUser({
          id: data.id,
          username: data.username || data.name || data.email || "User",
          name: data.name || data.username || data.email || "User",
          email: data.email,
          ...data
        });
        return true;
      } else {
        const errorData = await res.json();
        console.log("Token validation failed:", errorData);
        // Token is invalid, remove it
        localStorage.removeItem("token");
        return false;
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      localStorage.removeItem("token");
      return false;
    }
  };

  // On mount, check for token and restore user state if valid
  React.useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing auth...");
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);
      
      if (token) {
        console.log("Token found, validating...");
        const isValid = await validateToken(token);
        console.log("Token validation result:", isValid);
        if (!isValid) {
          setUser(null);
        }
      } else {
        console.log("No token found");
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

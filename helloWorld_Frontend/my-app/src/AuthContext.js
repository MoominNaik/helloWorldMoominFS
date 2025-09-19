import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        return false;
      }
      localStorage.setItem("token", data.token);
      const userData = { id: data.id, username: data.username, name: data.name, email: data.email, ...data };
      setUser(userData);
      setLoading(false);
      navigate("/");
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error");
      setLoading(false);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:9091/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, name, email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return false;
      }

      const loginRes = await fetch("http://localhost:9091/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      const loginData = await loginRes.json();
      
      if (!loginRes.ok || loginData.error) {
        setError("Account created but login failed");
        setLoading(false);
        return false;
      }
      
      localStorage.setItem("token", loginData.token);
      const userData = { 
        id: loginData.id, 
        username: loginData.username, 
        name: loginData.name, 
        email: loginData.email, 
        ...loginData 
      };
      
      setUser(userData);
      setLoading(false);
      navigate("/");
      return true;
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const validateToken = useCallback(async (token) => {
    if (!token) return false;
    
    try {
      const res = await fetch("http://localhost:9091/api/users/me", {
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser({ 
          id: data.id, 
          username: data.username, 
          name: data.name, 
          email: data.email, 
          ...data 
        });
        return true;
      } else {
        localStorage.removeItem("token");
        return false;
      }
    } catch (err) {
      console.error("Token validation error:", err);
      localStorage.removeItem("token");
      return false;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await validateToken(token);
      }
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
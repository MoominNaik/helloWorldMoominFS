import React, { useState } from "react";
import { useAuth } from "../../AuthContext";

const Login = ({ onSwitch }) => {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!username || !password) {
      setFormError("Please enter both username and password.");
      return;
    }
    await login(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {(formError || error) && (
            <div className="text-red-400 text-sm">{formError || error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 rounded-lg shadow-md transition text-white font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-gray-400 text-sm mt-6 text-center">
          Don't have an account?{' '}
          <button className="text-green-400 hover:underline" onClick={onSwitch}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

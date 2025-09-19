import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    setFormError(null);
    if (!email || !password) {
      console.log('Validation failed: Missing email or password');
      setFormError("Please enter both email and password.");
      return;
    }
    try {
      console.log('Calling login function with:', { email });
      const success = await login(email, password);
      console.log('Login result:', { success });
      if (success) {
        console.log('Login successful, navigating to /');
        navigate("/", { replace: true });
      } else {
        console.log('Login failed, no success');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setFormError("An error occurred during login.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-800">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center tracking-wide">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {(formError || error) && (
            <div className="text-red-400 text-sm">{formError || error}</div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:opacity-90 rounded-xl shadow-lg transition text-white font-medium text-sm"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-gray-400 text-sm mt-6 text-center">
          Don't have an account?{" "}
          <button
            className="text-green-400 hover:text-green-300 hover:underline transition"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
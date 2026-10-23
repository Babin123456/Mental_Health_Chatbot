import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginCard = ({ onSwitchToSignup, onAuthSuccess }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      onAuthSuccess();
    } catch (err) {
      console.error("Login error:", err.response?.data?.message);
      setError(err.response?.data?.message || "Invalid credentials or login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
      <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-2 font-poppins">
        Welcome Back
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div className="relative flex items-center bg-gray-50 rounded-lg border p-3">
          <Mail className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="email"
            placeholder="Email"
            className="flex-1 bg-transparent focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="relative flex items-center bg-gray-50 rounded-lg border p-3">
          <Lock className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="flex-1 bg-transparent focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-500 cursor-pointer hover:opacity-95 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account?
        <Link to="#" onClick={onSwitchToSignup} className="text-purple-600 font-semibold ml-1 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginCard;

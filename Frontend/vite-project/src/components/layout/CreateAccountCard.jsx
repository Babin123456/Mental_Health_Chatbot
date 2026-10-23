import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CreateAccountCard = ({ onSwitchToLogin, onAuthSuccess }) => {
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup({ fullName, email, password });
      onAuthSuccess();
    } catch (err) {
      console.error("Signup error:", err.response?.data?.message);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
      <h2 className="text-3xl text-purple-700 mb-6 text-center font-poppins font-bold">
        Create an Account
      </h2>

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Full Name */}
        <div className="relative flex items-center bg-gray-50 rounded-lg border p-3">
          <User className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Full Name"
            className="flex-1 bg-transparent focus:outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

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
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative flex items-center bg-gray-50 rounded-lg border p-3">
          <Lock className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="flex-1 bg-transparent focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 py-3 rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-500 cursor-pointer hover:opacity-95 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Already have an account?
        <Link to="#" onClick={onSwitchToLogin} className="text-purple-600 font-semibold ml-1 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default CreateAccountCard;

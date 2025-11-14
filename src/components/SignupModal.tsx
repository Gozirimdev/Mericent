import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSignup = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Welcome ${data.user.email}! You will receive updates on new items.`);
        onClose();
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const response = await fetch("/api/google-signup", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        alert(`Welcome ${data.user.name}! You will receive updates on new items.`);
        onClose();
      } else {
        alert(data.message || "Google signup failed.");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      alert("Google signup failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] sm:w-[400px] text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-end">
          <button  onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <h2 className="text-xl text-primary dark:text-primary font-semibold mb-4">Sign up for updates</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Stay notified about the latest items in stock!
        </p>

        {/* Email Signup */}
        <div className="flex flex-col gap-3 mb-4 relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            disabled={loading}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            onClick={handleEmailSignup}
            className="bg-primary text-white py-2 px-4 rounded-lg hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up with Email"}
          </button>
        </div>

        <div className="my-2 text-gray-500 dark:text-gray-400">or</div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="bg-primary text-white w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
          disabled={loading}
        >
          <FcGoogle className="w-5 h-5" />
          Sign Up with Google
        </button>
      </motion.div>
    </div>
  );
};

export default SignupModal;

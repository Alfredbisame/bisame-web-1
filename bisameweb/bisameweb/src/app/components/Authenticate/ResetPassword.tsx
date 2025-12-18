"use client";
import { useState, useEffect } from "react";
import { FaEye, FaArrowRight, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import CustomizePrompt from "../ui/CustomizePrompt";
import { CiLock } from "react-icons/ci";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Access localStorage only after component mounts
    const storedUserId = window.localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please try again or contact support.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Changing password for user:", userId);

      const payload = {
        password: password,
      };

      console.log("Sending change password request with payload:", payload);

      const response = await axios({
        method: "POST",
        url: "/api/auth/changepassword",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      });

      console.log("Change Password API Response:", response.data);

      if (response.status === 200 && response.data.success) {
        toast.success(
          response.data.message || "Password changed successfully!"
        );

        // Clear any stored credentials
        localStorage.removeItem("userId");

        // Redirect to login page after successful password change
        setTimeout(() => {
          router.push("/UserAccounts/SignIn");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to change password");
      }
    } catch (error: unknown) {
      console.error("Change Password API Error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 503) {
            toast.error(
              "Authentication service is currently unavailable. Please try again later."
            );
          } else {
            toast.error(
              `Error: ${
                error.response.data.message ||
                error.response.data.error ||
                "Failed to change password"
              }`
            );
          }
        } else if (error.request) {
          toast.error(
            "Network error - Please check your connection and try again later"
          );
        } else {
          toast.error(`Unexpected error: ${error.message}`);
        }
      } else {
        toast.error(`Unexpected error: ${error as string}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center md:py-10 bg-gray-100">
      <div className="bg-white p-8 rounded-md md:shadow-md w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center">
          <h2 className="sm:text-xl md:text-2xl font-semibold text-center mb-2 text-orange-400">
            Reset Password
          </h2>
          <div className="h-1 w-20 bg-orange-500 rounded-full"></div>
          <CustomizePrompt
            icon={<CiLock color="orange" />}
            backgroundColor="orange"
            textColor="blue"
            message="Create a strong, unique password to secure your account. Make it memorable but hard to guess!"
          />
          <p className="text-center mb-6 text-xs text-gray-400 font-semibold">
            Your security is our top priority!
          </p>
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label
            className="block text-blue-500  text-sm mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8+ characters"
              className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
            >
              <FaEye />
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label
            className="block text-blue-500  text-sm mb-2"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="8+ characters"
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
            >
              <FaEye />
            </button>
          </div>
        </div>

        {/* Reset Password Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting || !password || !confirmPassword}
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <FaSpinner size={15} className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <span className="flex items-center text-sm">
              Reset Password <FaArrowRight size={10} className="ml-2" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;

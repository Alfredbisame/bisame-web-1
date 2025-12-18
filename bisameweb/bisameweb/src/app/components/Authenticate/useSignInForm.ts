import { useState } from "react";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { getTime } from "@/app/utils/verify";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  request?: unknown;
  message?: string;
}

interface LoginResponse {
  code: number;
  data: {
    token: string;
    phoneNumber: string;
    verificationCodeExpiresAt: string;
  };
  message: string;
}

interface LoginRequest {
  phoneNumber: string;
  password: string;
  countryShortName: string;
}

// Function to handle login API call using the external route
async function loginUser(url: string, { arg }: { arg: LoginRequest }) {
  // apiUrl
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;
  const loginPath = process.env.NEXT_PUBLIC_LOGIN_API_URL;

  if (!baseUrl || !loginPath) {
    throw new Error("Missing env variable");
  }

  // Combine base URL and login path
  const apiUrl = `${baseUrl.replace(/\/$/, "")}${loginPath}`;

  return axios
    .post(apiUrl, arg, {
      headers: {
        "Content-Type": "application/json",
      },
      // withCredentials: true,
    })
    .then((res) => res.data);
}

export const useSignInForm = (onLoginSuccess?: () => void) => {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // SWR Mutation for handling login API call
  const { trigger, isMutating, data } = useSWRMutation(
    "/api/auth/login",
    loginUser,
    {
      onSuccess: (data: LoginResponse) => {
        // Check if the response is successful
        if (data.code === 200 && data.data) {
          // Store token in localStorage if present
          if (data.data.token) {
            if (typeof window !== "undefined") {
              // Store in localStorage
              localStorage.setItem("authToken", data.data.token);
              localStorage.setItem("auth_token", data.data.token); // consistency

              // TODO: Unsafe, this might be accessible via XSS attack
              // TODO: Must be improved in the future
              // Store in a cookie
              const token = data.data.token;
              const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
              const secure =
                window.location.protocol === "https:" ? "Secure;" : "";

              document.cookie = `auth-token=${token}; Path=/; Max-Age=${maxAge}; ${secure} SameSite=Lax;`;
            }
          }

          // Store phone number in localStorage if present
          if (data.data.phoneNumber) {
            if (typeof window !== "undefined") {
              localStorage.setItem("phoneNumber", data.data.phoneNumber);
              localStorage.setItem("userId", data.data.phoneNumber); // Store as userId for verification
            }
          }

          // Store verification code expiry time
          if (data.data.verificationCodeExpiresAt) {
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "verificationCodeExpiresAt",
                data.data.verificationCodeExpiresAt
              );
            }
          }

          localStorage.setItem(
            "verifyTime",
            JSON.stringify(getTime(data.data.verificationCodeExpiresAt))
          );

          // Show success message from API response
          toast.success(
            data.message ||
              "Successfully logged in! Please verify your account."
          );

          // Dispatch custom event to notify other components
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("loginSuccess"));
          }

          // Call the callback to notify parent components
          if (onLoginSuccess) {
            onLoginSuccess();
          }

          // Navigate to verification page after successful login
          localStorage.setItem("prevNav", JSON.stringify(pathname));
          router.push("/userVerification");
        } else {
          // Handle unsuccessful response
          toast.error(data.message || "Login failed. Please try again.");
        }
      },
      onError: (error: unknown) => {
        console.error("Login Error:", error);

        if (axios.isAxiosError(error)) {
          const apiError = error as ApiError;
          if (apiError.response) {
            const errorMessage =
              apiError.response.data?.message ||
              "An unexpected error occurred.";
            toast.error(errorMessage);
          } else if (apiError.request) {
            toast.error(
              "Unable to connect to the server. Please check your internet connection."
            );
            console.error(apiError.request);
          } else {
            toast.error("An error occurred while processing your request.");
          }
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      },
    }
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    const formattedPhone = phoneNumber
      .replace(/\s+/g, "")
      .replace(/[+()-]/g, "");

    if (formattedPhone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    await trigger({
      phoneNumber: formattedPhone,
      password: password,
      countryShortName: "GH", // Default to Ghana, can be made configurable later
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    // State
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    showPassword,

    // Actions
    handleSubmit,
    togglePasswordVisibility,

    // SWR state
    isMutating,
  };
};

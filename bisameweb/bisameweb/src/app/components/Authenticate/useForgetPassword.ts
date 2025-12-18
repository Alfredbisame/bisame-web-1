import { useState } from "react";
import axios from "axios";
import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
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

interface ForgotPasswordResponse {
  code: number;
  data: {
    token: string;
    phoneNumber: string;
    verificationCodeExpiresAt: string;
  };
  message: string;
}

interface ForgotPasswordRequest {
  phoneNumber: string;
  countryShortName: string;
}

// Function to handle forgot password API call
async function forgotPassword(
  url: string,
  { arg }: { arg: ForgotPasswordRequest }
) {
  return axios
    .post("/api/auth/forget", arg, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);
}

export const useForgetPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const router = useRouter();

  // SWR Mutation for handling forgot password API call
  const { trigger, isMutating } = useSWRMutation(
    "/api/auth/forget",
    forgotPassword,
    {
      onSuccess: (data: ForgotPasswordResponse) => {
        // Check if the response is successful
        if (data.code === 200 && data.data) {
          // Store token in localStorage if present
          if (data.data.token) {
            if (typeof window !== "undefined") {
              localStorage.setItem("authToken", data.data.token);
              localStorage.setItem("auth_token", data.data.token);
              localStorage.setItem(
                "verifyTime",
                JSON.stringify(getTime(data.data.verificationCodeExpiresAt))
              );
            }
          }

          // Store phone number in localStorage if present
          if (data.data.phoneNumber) {
            if (typeof window !== "undefined") {
              localStorage.setItem("phoneNumber", data.data.phoneNumber);
              localStorage.setItem("userId", data.data.phoneNumber); 
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

          // Show success message from API response
          toast.success(
            data.message ||
              "Verification code sent successfully! Please check your phone."
          );

          // Navigate to verification page
          router.push("/userVerification");
        } else {
          // Handle unsuccessful response
          toast.error(
            data.message ||
              "Failed to send verification code. Please try again."
          );
        }
      },
      onError: (error: unknown) => {
        console.error("Forgot Password Error:", error);

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

    const formattedPhone = phoneNumber
      .replace(/\s+/g, "")
      .replace(/[+()-]/g, "");

    if (formattedPhone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    await trigger({
      phoneNumber: formattedPhone,
      countryShortName: "GH", // Default to Ghana, can be made configurable later
    });
  };

  return {
    // State
    phoneNumber,
    setPhoneNumber,

    // Actions
    handleSubmit,

    // SWR state
    isMutating,
  };
};

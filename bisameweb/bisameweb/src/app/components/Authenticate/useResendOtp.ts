import { useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
import { getTime } from "@/app/utils/verify";

interface ResendOTPResponse {
  code: number;
  data: {
    user: null;
    token: string;
    phoneNumber: string;
    verificationCodeExpiresAt: string;
  };
  message: string;
}

// Mutation fetcher for SWR (no arg)
async function resendOTPCode(url: string): Promise<ResendOTPResponse> {
  if (typeof window === "undefined") {
    throw new Error("Resend OTP can only be used in the browser");
  }

  // Get auth token from localStorage
  const authToken = window.localStorage.getItem("authToken");

  console.log("Resend OTP - Auth token exists:", !!authToken);

  if (!authToken) {
    throw new Error("Authentication token not found. Please sign in again.");
  }

  console.log("Resend OTP - Making request to:", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: "",
  });

  console.log("Resend OTP - Response status:", response.status);

  if (!response.ok) {
    let errorMessage = "Failed to resend OTP code";
    try {
      const errorData = await response.json();
      console.error("Resend OTP - Error response:", errorData);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      console.error("Resend OTP - Failed to parse error response:", e);
    }
    throw new Error(errorMessage);
  }

  const responseData: ResendOTPResponse = await response.json();
  console.log("Resend OTP - Success response:", responseData);

  if (!responseData) {
    throw new Error("Invalid response from server");
  }

  // Update the token in localStorage if a new one is provided
  if (responseData.data?.token && typeof window !== "undefined") {
    window.localStorage.setItem("authToken", responseData.data.token);
    console.log("Resend OTP - Token updated in localStorage");
  }

  return responseData;
}

export const useResendOTP = () => {
  // SWR Mutation for resend OTP
  const { trigger: resendTrigger, isMutating: isResending } = useSWRMutation<
    ResendOTPResponse,
    Error
  >("/api/auth/resend", resendOTPCode, {
    onSuccess: (data: ResendOTPResponse) => {
      console.log("Resend OTP successful:", data);

      if (data.code === 200) {
        toast.success(data.message || "Verification code resent successfully!");

        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "verifyTime",
            JSON.stringify(getTime(data.data.verificationCodeExpiresAt))
          );
          window.location.reload();
        }

        console.log(data.data.verificationCodeExpiresAt);
      } else {
        toast.error(data.message || "Failed to resend code. Please try again.");
      }
    },
    onError: (error: Error) => {
      console.error("Resend OTP failed - Full error:", error);
      console.error("Resend OTP failed - Error type:", typeof error);

      const errorMessage = error.message || "An unexpected error occurred";

      toast.error(`Failed to resend code: ${errorMessage}`);
    },
  });

  // Handle resend OTP
  const handleResendOTP = useCallback(async () => {
    console.log("Resend OTP button clicked");
    try {
      await resendTrigger();
    } catch (error) {
      // Error is handled by SWR onError
      console.error("Resend OTP error in handler:", error);
    }
  }, [resendTrigger]);

  return {
    handleResendOTP,
    isResending,
  };
};

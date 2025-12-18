import { useState, useEffect, useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface VerificationRequest {
  verificationCode: string;
  authToken: string;
}

interface VerificationResponse {
  code: number;
  data: {
    token: string;
    user: {
      id: string;
      email: string | null;
      phoneNumber: string;
      countryCode: string;
      countryName: string;
      countryShortName: string;
      profilePicture: string | null;
      referralCode: string;
      userReferralCode: string;
      referralType: string;
      status: string;
      role: string;
      lastName: string;
      firstName: string;
      otherNames: string;
      authenticated: boolean;
      dateOfBirth: string | null;
    };
  };
  message: string;
}

// Function to handle verification API call
async function verifyUser(
  url: string,
  { arg }: { arg: VerificationRequest }
): Promise<VerificationResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Verification failed");
  }

  const responseData = await response.json();

  if (!responseData) {
    throw new Error("Invalid response from server");
  }

  return responseData;
}

export const useVerificationForm = () => {
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill("")
  );
  const [authToken, setAuthToken] = useState<string>("");
  const [previousPathname, setPreviousPathname] = useState<string | null>(null);

  const router = useRouter();

  // Get authToken + prevNav from localStorage on mount (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedAuthToken = window.localStorage.getItem("authToken");
    if (storedAuthToken) {
      setAuthToken(storedAuthToken);
    }

    const prev = window.localStorage.getItem("prevNav");
    if (prev) {
      setPreviousPathname(prev);
    }
  }, []);

  // SWR Mutation for verification
  const { trigger: verifyTrigger, isMutating: isVerifying } = useSWRMutation(
    "/api/auth/verify",
    verifyUser,
    {
      onSuccess: (data: VerificationResponse) => {
        console.log("Verification successful:", data);

        // Check if the response is successful
        if (data.code === 200 && data.data) {
          if (typeof window !== "undefined") {
            // Store the new token from verification response
            if (data.data.token) {
              window.localStorage.setItem("authToken", data.data.token);
            }

            // Store user data
            if (data.data.user) {
              window.localStorage.setItem(
                "user",
                JSON.stringify(data.data.user)
              );
            }
          }

          // Use the message from the API response
          toast.success(data.message || "Account verified successfully!");

          if (previousPathname) {
            router.push("/");
            if (typeof window !== "undefined") {
              window.localStorage.removeItem("prevNav");
            }
          } else {
            router.push("/UserAccounts/Reset_password");
          }
        } else {
          toast.error(data.message || "Verification failed. Please try again.");
        }
      },
      onError: (error: Error) => {
        console.error("Verification failed:", error.message);
        toast.error(`Verification failed: ${error.message}`);
      },
    }
  );

  // Handle verification code input changes
  const handleCodeChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) return;

      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
    },
    [verificationCode]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!authToken) {
        toast.error("Authentication token not found. Please sign in again.");
        return;
      }

      const code = verificationCode.join("");
      if (code.length !== 6) {
        toast.error("Please enter the complete 6-digit verification code.");
        return;
      }

      try {
        await verifyTrigger({
          verificationCode: code,
          authToken: authToken,
        });
      } catch (error) {
        // Error is handled by SWR onError
        console.error("Verification error:", error);
      }
    },
    [authToken, verificationCode, verifyTrigger]
  );

  // Reset verification code
  const resetCode = useCallback(() => {
    setVerificationCode(Array(6).fill(""));
  }, []);

  return {
    // State
    verificationCode,
    authToken,

    // Actions
    handleCodeChange,
    handleSubmit,
    resetCode,

    // Loading states
    isVerifying,
    isSubmitting: isVerifying,
  };
};

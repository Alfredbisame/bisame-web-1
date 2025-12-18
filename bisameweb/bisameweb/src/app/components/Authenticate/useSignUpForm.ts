import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

// Import utilities and custom hooks
import { validateSignUpForm, type FormData } from "./validationUtils";
import { useFormState } from "./useFormState";

interface RegisterRequestBody {
  first: string;
  last: string;
  phone: string;
  email: string;
  password: string;
  refecode: string;
  countryname: string;
  countryiso2: string;
  countrycode: string;
  choose: string;
  type: string;
}

// Updated interface to match the new response structure
interface RegisterResponse {
  code: number;
  data: {
    token: string;
    phoneNumber: string;
    verificationCodeExpiresAt: string;
  };
  message: string;
}

export const useSignUpForm = () => {
  const router = useRouter();
  const previousPathname = usePathname();

  // Use the custom form state hook
  const formState = useFormState();

  // SWR Mutation for Form Submission
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/auth/register",
    async (_, { arg }: { arg: RegisterRequestBody }) => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(arg),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        }

        const responseData: RegisterResponse = await response.json();
        console.log("Frontend received response:", responseData);

        // Validate response structure
        if (!responseData) {
          throw new Error("Invalid response from server");
        }
        localStorage.removeItem("prevNav");
        return responseData;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unexpected error occurred");
      }
    },
    {
      onSuccess: (data: RegisterResponse) => {
        console.log("Registration successful:", data);

        toast.success(data.message || "Registration successful!");

        // Store the token in localStorage for verification
        if (data && data.data && data.data.token) {
          localStorage.setItem("authToken", data.data.token);
          localStorage.setItem("phoneNumber", data.data.phoneNumber);
        } else {
          console.warn("No token found in response data:", data);
        }

        // Reset form using the custom hook method
        formState.resetForm();

        // Navigate to verification page with the token
        localStorage.setItem("prevNav", previousPathname);
        router.push(`/userVerification?token=${data.data.token}`);
      },
      onError: (err: Error) => {
        console.error("Registration failed:", err.message);
        console.error("Full error object:", err);

        toast.error(`Registration failed: ${err.message}`);
      },
    }
  );

  /**
   * Handles form submission with validation
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Create form data object for validation
      const formData: FormData = {
        firstName: formState.firstName,
        lastName: formState.lastName,
        phoneNumber: formState.phoneNumber || "",
        email: formState.email,
        password: formState.password,
        confirmPassword: formState.confirmPassword,
        termsAccepted: formState.termsAccepted,
      };

      // Validate form data
      const validation = validateSignUpForm(formData);

      if (!validation.isValid) {
        // Show first error message
        toast.error(validation.errors[0]);
        return;
      }

      // Create request body with default verification method (sms)
      const requestBody: RegisterRequestBody = {
        first: formState.firstName,
        last: formState.lastName,
        phone: formState.phoneNumber!,
        email: formState.email || "",
        password: formState.password,
        refecode: formState.referralCode,
        countryname: "Ghana",
        countryiso2: "GH",
        countrycode: "+233",
        choose: formState.hearAboutUs,
        type: "sms", // Default to SMS verification
      };

      // Directly trigger the registration without showing modal
      trigger(requestBody);
    },
    [formState, trigger]
  );

  return {
    // Form state (destructured from the custom hook)
    ...formState,

    // Actions
    handleSubmit,

    // SWR state
    isMutating,
    error,
  };
};

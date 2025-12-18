import { useState } from 'react';
import { mutate } from 'swr';

interface PasswordChangeRequest {
  oldpassword: string;
  newpassword: string;
}

interface PasswordChangeResponse {
  message: string;
}

interface PasswordChangeError {
  message: string;
  error?: unknown;
}

interface UsePasswordChangeReturn {
  changePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  loading: boolean;
  error: PasswordChangeError | null;
  success: boolean;
  resetState: () => void;
}

// Fetcher function for SWR
const fetcher = async (url: string, body: PasswordChangeRequest): Promise<PasswordChangeResponse> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to change password');
  }

  return data;
};

export function usePasswordChange(): UsePasswordChangeReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PasswordChangeError | null>(null);
  const [success, setSuccess] = useState(false);

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> => {
    // Reset state
    resetState();

    // Validation
    if (!oldPassword.trim()) {
      setError({ message: 'Old password is required' });
      return false;
    }

    if (!newPassword.trim()) {
      setError({ message: 'New password is required' });
      return false;
    }

    if (!confirmPassword.trim()) {
      setError({ message: 'Confirm password is required' });
      return false;
    }

    if (newPassword.length < 6) {
      setError({ message: 'New password must be at least 6 characters long' });
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError({ message: 'New password and confirm password do not match' });
      return false;
    }

    if (oldPassword === newPassword) {
      setError({ message: 'New password must be different from old password' });
      return false;
    }

    setLoading(true);

    try {
      const requestBody: PasswordChangeRequest = {
        oldpassword: oldPassword,
        newpassword: newPassword,
      };

      // Use SWR's mutate for the API call
      await mutate(
        '/api/Dashboard/Settings/DashboardChangePassword',
        fetcher('/api/Dashboard/Settings/DashboardChangePassword', requestBody),
        {
          revalidate: false, // Don't revalidate after mutation
        }
      );

      setSuccess(true);
      return true;
    } catch (err: unknown) {
      let message = 'An unexpected error occurred';
      if (err instanceof Error) {
        message = err.message;
      }
      setError({
        message,
        error: err,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading,
    error,
    success,
    resetState,
  };
} 
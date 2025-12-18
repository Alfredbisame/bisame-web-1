import { useState } from 'react';

interface FollowResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

interface UseFollowReturn<T = unknown> {
  follow: (toUserId: string) => Promise<FollowResponse<T>>;
  loading: boolean;
  error: string | null;
}

export function useFollow<T = unknown>(): UseFollowReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const follow = async (toUserId: string): Promise<FollowResponse<T>> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/Dashboard/Followers/Follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toUserId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to follow user');
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    follow,
    loading,
    error,
  };
}
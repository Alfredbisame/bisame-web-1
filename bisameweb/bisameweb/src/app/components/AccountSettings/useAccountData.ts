import useSWR from 'swr';
import { AccountData } from './types';

// Simple fetcher that relies on cookies for auth
const fetcher = async (url: string): Promise<AccountData> => {
  const res = await fetch(url, {
    credentials: 'include', // Ensure cookies are sent
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to fetch account data.');
  }

  return res.json();
};

export function useAccountData() {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<AccountData, Error>(
    '/api/Dashboard/Settings',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onErrorRetry: (_err, _key, _config, revalidate, { retryCount }) => {
        if (retryCount < 3) {
          setTimeout(() => revalidate({ retryCount }), 1000);
        }
      },
    }
  );
  
  return {
    data,
    loading: isLoading,
    error,
    mutate,
  };
} 
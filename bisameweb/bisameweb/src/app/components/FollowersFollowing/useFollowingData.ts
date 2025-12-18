import useSWR from 'swr';
import { FollowingResponse } from './types';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch following data');
  return res.json();
});

export function useFollowingData(page: number = 1, pageSize: number = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/Dashboard/Followers/MyFollowing?page=${page}&pageSize=${pageSize}`, 
    fetcher, 
    {
      dedupingInterval: 2 * 60 * 60 * 1000, // 2 hours
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data: data as FollowingResponse | null,
    loading: isLoading,
    error: error ? error.message : null,
    mutate,
  };
}
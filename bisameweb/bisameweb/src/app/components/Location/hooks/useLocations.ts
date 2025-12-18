import useSWR from 'swr';

export interface City {
  name: string;
  ads: number;
}

export interface Region {
  region: string;
  ads: number;
  cities: City[];
}

interface UseLocationsResult {
  data: Region[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to fetch locations');
  }
  return res.json();
};

// Cache key for consistent caching
const LOCATIONS_CACHE_KEY = '/api/Locations';

// 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export function useLocations(): UseLocationsResult {
  const { data, error, isLoading, mutate } = useSWR<Region[]>(LOCATIONS_CACHE_KEY, fetcher, {
    dedupingInterval: CACHE_DURATION, 
    refreshInterval: 0, 
    revalidateOnFocus: false, 
    revalidateOnReconnect: false,
    revalidateIfStale: false, 
    refreshWhenHidden: false, 
    refreshWhenOffline: false, 
    shouldRetryOnError: true, 
    errorRetryCount: 3, 
    errorRetryInterval: 5000, 
    keepPreviousData: true,
    provider: () => new Map(),
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error.message || 'Unknown error') : null,
    refetch: () => { mutate(); },
  };
}
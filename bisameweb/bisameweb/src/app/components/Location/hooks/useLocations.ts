import useSWR from 'swr';
import { getApiConfig } from "@/app/utils/apiConfig";

export interface City {
  name: string;
  ads: number;
}

export interface Region {
  region: string;
  ads: number;
  cities: City[];
}

interface ApiCity {
  city: string;
  totalListings: number;
}

interface ApiRegionData {
  totalListings: number;
  cities: ApiCity[];
  region: string;
}

interface ApiResponse {
  code: number;
  data: ApiRegionData[];
  message: string;
}

interface UseLocationsResult {
  data: Region[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const fetcher = async () => {
  const { endpoints } = getApiConfig();
  const res = await fetch(endpoints.regions);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to fetch locations');
  }

  const responseData: ApiResponse = await res.json();

  // Transform data to match component expectation
  if (responseData.data && Array.isArray(responseData.data)) {
    return responseData.data.map(region => ({
      region: region.region,
      ads: region.totalListings,
      cities: region.cities.map(city => ({
        name: city.city,
        ads: city.totalListings
      }))
    }));
  }

  return [];
};

// 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export function useLocations(): UseLocationsResult {
  const { data, error, isLoading, mutate } = useSWR<Region[]>('locations', fetcher, {
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
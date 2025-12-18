import useSWR from 'swr';
import { Product } from '../types';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Handle the new API response structure
  if (data.code === 200 && Array.isArray(data.data)) {
    return data.data;
  }
  
  // Fallback for old structure or direct array
  return Array.isArray(data) ? data : [];
};

export const useTrendingProducts = (maxProducts: number = 16) => {
  const { data, error, isLoading, mutate } = useSWR('/api/trending-listings', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 3600000, 
    refreshInterval: 0, 
    refreshWhenHidden: false,
    refreshWhenOffline: false, 
    shouldRetryOnError: true,
    errorRetryCount: 3
  });
  
  // Slice the data to get only the specified number of products
  const products = data ? data.slice(0, maxProducts) : [];
  
  return {
    products: products as Product[],
    error,
    isLoading,
    retry: mutate
  };
}; 
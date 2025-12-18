import useSWR from 'swr';
import { Product, ApiResponse } from '../types';
import { getSectionApiUrl } from '../../../../utils/apiConfig';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: ApiResponse = await response.json();

  // Extract the results array from the response
  return data.data.results;
};

export const useTopMarketplaceDeals = (maxProducts: number = 5) => {
  const apiUrl = getSectionApiUrl('Top Marketplace Deals');

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
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
    isLoading
  };
};
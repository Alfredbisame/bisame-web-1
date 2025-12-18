import useSWR from 'swr';
import { Product } from '../types';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  const data = await response.json();

  return data.data;
};

// Add badge to products
const addBadgesToProducts = (products: Product[]): Product[] => {
  return products.map(product => ({
    ...product,
    badge: {
      text: "NEW ARRIVAL",
      color: "bg-green-500"
    }
  }));
};

export const useLatestListings = (maxProducts: number = 5) => {
  const { data, error, isLoading } = useSWR('/api/latest-listings', fetcher, {
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
  
  // Add badges to all products
  const productsWithBadges = addBadgesToProducts(products as Product[]);
  
  return {
    products: productsWithBadges,
    error,
    isLoading
  };
};
"use client";

import useSWR from "swr";

export interface Product {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  childCategory?: string | null;
  price: number | string;
  contactNumber: string;
  totalViews: number;
  location: string;
  userId: string;
  isPromoted: boolean;
  images: Array<{
    imageUrl: string;
    id: string;
    [key: string]: unknown;
  }>;
  userInfo: {
    name: string;
    profilePicture: string;
    [key: string]: unknown;
  };
  status: string;
  negotiable: boolean;
  attributes: {
    [key: string]: unknown;
  };
  isFavorite: boolean;
  totalReviews: number;
  isFollowed: boolean;
  createdAt: string;
  updatedAt: string;
  brand?: string;
  availability?: string;
  rating?: number;
  reviews?: number | unknown[];
  categoryGroup?: string;
  city?: string;
  region?: string;
  [key: string]: unknown;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};

export const useProductData = (listingId: string | null) => {
  // Fetch listing details by ID
  const {
    data: product,
    error,
    isLoading,
  } = useSWR(
    listingId ? `/api/listing-details?id=${listingId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 3600000,
      refreshInterval: 0,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  // Logic to save the product for the context whenever product is present


  return {
    product,
    isLoading,
    hasError: !!error,
    error,
  };
};

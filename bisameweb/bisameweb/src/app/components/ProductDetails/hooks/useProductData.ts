"use client";

import useSWR from "swr";
import axios from "axios";
import { getApiConfig } from "@/app/utils/apiConfig";

export interface ProductImage {
  imageUrl: string;
  id: string;
}

export interface ProductUserInfo {
  name: string;
  profilePicture: string;
  [key: string]: unknown;
}

export interface Product {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  childCategory: string | null;
  price: number | string;
  contactNumber: string;
  totalViews: number;
  location: string;
  userId: string;
  isPromoted: boolean;
  images: ProductImage[];
  userInfo: ProductUserInfo;
  status: string;
  negotiable: boolean;
  attributes: {
    keyFeatures?: string;
    [key: string]: any;
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
  [key: string]: unknown;
}

export interface ProductDataResponse {
  product: Product | undefined;
  isLoading: boolean;
  hasError: boolean;
  error: any;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data.data;
};

export const useProductData = (listingId: string | null): ProductDataResponse => {
  const { endpoints } = getApiConfig();

  // Fetch listing details by ID
  const {
    data: product,
    error,
    isLoading,
  } = useSWR<Product>(
    listingId ? endpoints.listingDetails(listingId) : null,
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

  return {
    product,
    isLoading,
    hasError: !!error,
    error,
  };
};

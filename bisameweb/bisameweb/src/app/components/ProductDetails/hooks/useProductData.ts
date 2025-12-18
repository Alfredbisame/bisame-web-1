"use client";

import useSWR from "swr";
import axios from "axios";
import { getApiConfig } from "@/app/utils/apiConfig";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data.data;
};

export const useProductData = (listingId: string | null) => {
  const { endpoints } = getApiConfig();

  // Fetch listing details by ID
  const {
    data: product,
    error,
    isLoading,
  } = useSWR(
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

  // Logic to save the product for the context whenever product is present


  return {
    product,
    isLoading,
    hasError: !!error,
    error,
  };
};

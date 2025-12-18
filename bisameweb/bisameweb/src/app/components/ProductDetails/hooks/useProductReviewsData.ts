import useSWRInfinite from 'swr/infinite';
import axios from 'axios';
import { getApiConfig } from "@/app/utils/apiConfig";
import type { Review } from '../types';

interface ApiResponse {
  code: number;
  data: {
    page: number;
    pageSize: number;
    results: Review[];
    totalCount: number;
    totalPages: number;
  };
  message: string;
}

function ceilToOneDecimal(num: number): number {
  return Math.ceil(num * 10) / 10;
}

const fetcher = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const res = await axios.get(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    }
  });
  return res.data;
};

// Function to get the key for SWR Infinite
const getKey = (pageIndex: number, previousPageData: ApiResponse | null, userId: string | null) => {
  const { endpoints } = getApiConfig();
  // Using listingReviews endpoint (maps to /v1/api/customer-reviews)
  const baseUrl = endpoints.listingReviews;

  // Reached the end
  if (previousPageData && previousPageData.data && previousPageData.data.results.length === 0) return null;

  if (!userId) return null;

  // Construct URL with params
  // First page or subsequent pages
  const page = pageIndex + 1;
  return `${baseUrl}?userId=${encodeURIComponent(userId)}&page=${page}&pageSize=5`;
};

export function useProductReviewsData(userId: string | null) {
  const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<ApiResponse>(
    (...args) => getKey(args[0], args[1], userId),
    fetcher,
    {
      dedupingInterval: 2 * 60 * 1000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Flatten the paginated data
  const flatData = data ? data.flatMap(page => page.data?.results || []) : [];

  // Check if there is more data to load
  const isEmpty = data?.[0]?.data?.results?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data?.results?.length < 5);

  // Calculate total count and average rating
  let mapped: { reviews: Review[]; total: number; average_rating: number; totalPages: number } | null = null;
  if (data && data[0] && data[0].code === 200) {
    // Calculate average rating from the reviews
    let totalRating = 0;
    const reviewCount = flatData.length || 0;

    // Use the reviews directly from the API response
    const reviews = flatData as Review[];

    // Calculate total rating for average
    reviews.forEach((review: Review) => {
      totalRating += review.rating;
    });

    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    mapped = {
      reviews,
      total: data[0].data?.totalCount || 0,
      average_rating: ceilToOneDecimal(averageRating),
      totalPages: data[0].data?.totalPages || 0
    };
  }

  const loadMore = () => {
    setSize(size + 1);
  };

  return {
    data: mapped,
    loading: isLoading,
    isValidating,
    error: error ? error.message : null,
    refetch: mutate,
    loadMore,
    isReachingEnd,
    size
  };
}
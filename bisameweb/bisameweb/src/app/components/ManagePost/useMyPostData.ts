import useSWR from 'swr';
import { MyPostResponse, Product } from './types';

function mapToProduct(item: Product): Product {
  return {
    _id: item._id,
    id: item.id || item._id || '',
    name: item.title || item.name || '',
    title: item.title,
    images: item.images,
    description: item.description || '',
    location: item.location || '',
    price: item.price?.toString() || item.price || '',
    status: item.status,
    message: item.message,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch MyPost data');
  return res.json();
});

export function useMyPostData(status?: string) {
  // Build URL with optional status parameter
  const url = status 
    ? `/api/Dashboard/MyPost?status=${status}`
    : '/api/Dashboard/MyPost';

  const { data, error, isLoading } = useSWR<MyPostResponse>(url, fetcher, {
    dedupingInterval: 2 * 60 * 60 * 1000, // 2 hours
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });


  let mapped: { results: Product[]; totalCount: number; totalPages: number; page: number; pageSize: number } | null = null;
  if (data) {
    // Handle the new response format directly
    if (data.data && data.data.results) {
      // New API format
      mapped = {
        results: data.data.results.map(mapToProduct),
        totalCount: data.data.totalCount,
        totalPages: data.data.totalPages,
        page: data.data.page,
        pageSize: data.data.pageSize
      };
    }
  }

  return {
    data: mapped,
    loading: isLoading,
    error: error ? error.message : null,
  };
}
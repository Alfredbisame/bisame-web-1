import useSWR from 'swr';
import { getImageUrl } from '@/app/components/ProductDetails/utils/imageUtils';
import { SellerInfoResponse } from './types';

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch seller info');
    }
    return res.json();
  });

export function useSeller(productId?: string) {
  // Try to get productId from localStorage if not provided
  let id = productId;
  if (typeof window !== 'undefined' && !id) {
    id = localStorage.getItem('selectedProductId') || undefined;
  }
  const endpoint = id ? `/api/SellerInfo?productId=${id}` : '/api/SellerInfo';
  const { data, error, isLoading } = useSWR<SellerInfoResponse>(endpoint, fetcher);

  // Process images only if data is available
  const processedData = data
    ? {
        ...data,
        profile: getImageUrl(data.profile),
        data: data.data.map((ad) => ({
          ...ad,
          image: ad.image?.map(img => ({
            ...img,
            image_link: getImageUrl(img.image_link),
          })) || [],
          addimage: ad.addimage?.map(img => ({
            ...img,
            image_link: getImageUrl(img.image_link),
          })) || [],
          info: {
            ...ad.info,
            image: getImageUrl(ad.info.image),
          },
        })),
      }
    : null;

  return {
    data: processedData,
    loading: isLoading,
    error: error ? error.message : null,
  };
} 
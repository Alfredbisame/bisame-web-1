import useSWR from 'swr';

export interface PostUpdateInfo {
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  createdBy: string | null;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  childCategory: string | null;
  price: number;
  contactNumber: string;
  totalViews: number;
  location: string;
  userId: string;
  isPromoted: boolean;
  images: Array<{ imageUrl: string; id: string }>;
  userInfo: {
    name: string;
    profilePicture: string;
  };
  status: string;
  message: string;
  negotiable: boolean;
  attributes: {
    [key: string]: unknown;
  };
  __v: number;
}

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch post update data');
  }
  return response.json();
};

export function usePostUpdateFetch(id: string | undefined) {
  const shouldFetch = Boolean(id);
  // Use the main API endpoint to fetch data for a specific post
  const { data, error, isLoading } = useSWR<{ code: number; data: PostUpdateInfo; message: string }>(
    shouldFetch ? `/api/Dashboard/MyPost?postId=${id}` : null,
    fetcher
  );

  return {
    data: data?.data,
    loading: isLoading,
    error: error ? error.message : null,
  };
}
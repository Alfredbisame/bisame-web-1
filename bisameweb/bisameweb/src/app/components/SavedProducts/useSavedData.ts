import useSWR from "swr";

export interface SavedProduct {
  id: string;
  favoriteId?: string;
  pageid?: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  description: string;
  badge?: {
    text: string;
    color: string;
  };
  category?: string;
  subCategory?: string;
  userInfo?: {
    name: string;
    profilePicture: string;
  };
  images?: Array<{
    imageUrl: string;
    id: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedResponse {
  products: SavedProduct[];
  totalCount: number;
}

interface RawSavedItem {
  _id?: string;
  id?: string;
  favoriteId?: string;
  pageid?: string;
  title?: string;
  name?: string;
  image?: Array<{ image_link?: string; imageUrl?: string }> | string;
  price?: number | string;
  rating?: number;
  reviews?: number;
  location?: string;
  description?: string;
  badge?: {
    text?: string;
    color?: string;
  };
  category?: string;
  subCategory?: string;
  userInfo?: {
    name: string;
    profilePicture: string;
  };
  images?: Array<{
    imageUrl: string;
    id: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface SavedApiResponse {
  data?: RawSavedItem[];
  products?: RawSavedItem[];
  totalCount?: number;
  [key: string]: unknown;
}

function mapToSavedProductArray(items: RawSavedItem[]): SavedProduct[] {
  return (items || [])
    .filter((item): item is RawSavedItem => !!item && typeof item === "object")
    .map((item) => {
      let imageUrl = "";

      if (item.images && item.images.length > 0) {
        imageUrl = item.images[0].imageUrl || "";
      } else if (Array.isArray(item.image) && item.image.length > 0) {
        imageUrl = item.image[0].image_link || item.image[0].imageUrl || "";
      } else if (typeof item.image === "string") {
        imageUrl = item.image;
      }

      return {
        id: item.pageid || item._id || item.id || "",
        favoriteId: item.favoriteId,
        pageid: item.pageid,
        name: item.title || item.name || "",
        image: imageUrl,
        price:
          typeof item.price === "number"
            ? item.price
            : typeof item.price === "string"
            ? parseFloat(item.price) || 0
            : 0,
        rating: item.rating || 0,
        reviews: item.reviews || 0,
        location: item.location || "",
        description: item.description || "",
        category: item.category || "",
        subCategory: item.subCategory || "",
        userInfo: item.userInfo,
        images: item.images,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        badge: item.badge
          ? {
              text: item.badge.text || "",
              color: item.badge.color || "#FFD700",
            }
          : undefined,
      };
    });
}

const fetcher = async (url: string): Promise<SavedApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Saved data");
  return (await res.json()) as SavedApiResponse;
};

export function useSavedData() {
  const { data, error, isLoading } = useSWR<SavedApiResponse>(
    "/api/Dashboard/Saved",
    fetcher,
    {
      dedupingInterval: 2 * 60 * 60 * 1000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  let mapped: SavedResponse | null = null;

  if (data) {
    const productsData = (data.data || data.products || []) as RawSavedItem[];
    mapped = {
      products: mapToSavedProductArray(productsData),
      totalCount: data.totalCount ?? productsData.length,
    };
  }

  return {
    data: mapped,
    loading: isLoading,
    error: error ? error.message : null,
  };
}

import useSWR from "swr";
import axios from "axios";
import { getImageUrl } from "../../ProductDetails/utils/imageUtils";

export interface Subcategory {
  id: string;
  category: string;
  image_link: string;
  web_link?: string;
}

export interface CategoryData {
  category: string;
  total: number;
  sub: Subcategory[];
  group: string;
}

export interface UseCategoryDataReturn {
  data: CategoryData[] | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Shape of the API response: { data: CategoryData[]; ... }
interface CategoryApiResponse {
  data: CategoryData[];
  message?: string;
  success?: boolean;
}

// SWR fetcher function
import { getApiConfig } from "@/app/utils/apiConfig";

// ... existing types ...

// SWR fetcher function
const fetcher = async ({ url, group }: { url: string; group: string }): Promise<CategoryData[]> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    // Construct params locally
    const params = {
      page: 1,
      pageSize: 10,
      group
    };

    const response = await axios.get<CategoryApiResponse>(url, {
      params,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    const data = response.data?.data;

    // Validate response data structure
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format: expected array of categories");
    }

    // Validate & process image URLs
    const processedData: CategoryData[] = data.map((category, index) => {
      // ... existing validation logic ...
      if (!category.category || typeof category.category !== "string") {
        throw new Error(`Invalid category name at index ${index}`);
      }
      if (typeof category.total !== "number") {
        throw new Error(
          `Invalid total count for category ${category.category}`
        );
      }
      if (!Array.isArray(category.sub)) {
        throw new Error(
          `Invalid subcategories array for category ${category.category}`
        );
      }

      const processedSubcategories: Subcategory[] = category.sub.map(
        (subcategory, subIndex) => {
          if (!subcategory.id || !subcategory.category) {
            throw new Error(
              `Invalid subcategory at index ${subIndex} in category ${category.category}`
            );
          }
          if (typeof subcategory.image_link !== "string") {
            throw new Error(
              `Invalid image_link for subcategory ${subcategory.category} in category ${category.category}`
            );
          }

          return {
            ...subcategory,
            image_link: getImageUrl(subcategory.image_link, 300, 300),
          };
        }
      );

      return {
        ...category,
        sub: processedSubcategories,
      };
    });

    return processedData;
  } catch (err: unknown) {
    // ... existing error handling ...
    console.error("Error fetching category data:", err);
    if (axios.isAxiosError(err)) {
      // ... handled same as before ...
      if (err.code === "ECONNABORTED") {
        throw new Error("Request timeout. Please check your internet connection and try again.");
      }
      // ... (keep existing logic or simplify if prefered, assuming existing logic is fine)
      if (err.response?.status === 401) throw new Error("Authentication failed. Please log in again.");
      // ...
      throw err; // Re-throw if not specifically handled or let implicit fallthrough
    }
    throw err;
  }
};

export const useCategoryData = (category: string): UseCategoryDataReturn => {
  const { endpoints } = getApiConfig();

  const { data, error, isLoading, mutate } = useSWR<CategoryData[], Error>(
    { url: endpoints.categories, group: category },
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 0,
      dedupingInterval: 2000,
      errorRetryInterval: 5000,
      errorRetryCount: 3,
    }
  );

  return {
    data,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: () => {
      void mutate();
    },
  };
};

// Helper function to get all subcategories across all categories
export const getAllSubcategories = (
  data: CategoryData[] | undefined
): (Subcategory & { parentCategory: string })[] => {
  if (!data) return [];

  return data.flatMap((category) =>
    category.sub.map((subcategory) => ({
      ...subcategory,
      parentCategory: category.category,
    }))
  );
};

// Helper function to search subcategories by name
export const searchSubcategories = (
  data: CategoryData[] | undefined,
  searchTerm: string
): (Subcategory & { parentCategory: string })[] => {
  if (!data || !searchTerm.trim()) return [];

  const term = searchTerm.toLowerCase();
  const allSubcategories = getAllSubcategories(data);

  return allSubcategories.filter(
    (subcategory) =>
      subcategory.category.toLowerCase().includes(term) ||
      subcategory.parentCategory.toLowerCase().includes(term)
  );
};

// Helper function to get subcategories by category
export const getSubcategoriesByCategory = (
  data: CategoryData[] | undefined,
  categoryName: string
): Subcategory[] => {
  if (!data) return [];

  const category = data.find(
    (c) => c.category.toLowerCase() === categoryName.toLowerCase()
  );
  return category?.sub ?? [];
};

// Helper function to find a specific subcategory by ID
export const findSubcategoryById = (
  data: CategoryData[] | undefined,
  subcategoryId: string
): (Subcategory & { parentCategory: string }) | undefined => {
  if (!data) return undefined;

  const allSubcategories = getAllSubcategories(data);
  return allSubcategories.find(
    (subcategory) => subcategory.id === subcategoryId
  );
};

// Helper function to get category by subcategory ID
export const getCategoryBySubcategoryId = (
  data: CategoryData[] | undefined,
  subcategoryId: string
): CategoryData | undefined => {
  if (!data) return undefined;

  return data.find((category) =>
    category.sub.some((subcategory) => subcategory.id === subcategoryId)
  );
};

// Helper function to get processed image URL for a subcategory
export const getSubcategoryImageUrl = (
  imageLink: string,
  width = 300,
  height = 300
): string => {
  return getImageUrl(imageLink, width, height);
};

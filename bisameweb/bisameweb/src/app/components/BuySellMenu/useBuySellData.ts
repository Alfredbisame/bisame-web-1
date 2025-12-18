import useSWR from "swr";

interface SubCategory {
  id: string;
  category: string;
  imageUrl: string;
  webImageUrl: string;
  childCategories: string[];
}

interface Category {
  id: string;
  category: string;
  isPromotion: boolean;
  group: string;
  subCategories: SubCategory[];
}

interface ProcessedCategory {
  name: string;
  id: string;
  hasSubmenu: boolean;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

export const useBuySellData = (group?: string) => {
  const {
    data: categoriesData,
    error,
    isLoading,
  } = useSWR(
    `/api/category/buysell?group=${encodeURIComponent(group as string)}`,
    fetcher
  );

  // Process categories for dropdown display
  const processedCategories: ProcessedCategory[] = categoriesData
    ? categoriesData.map((category: Category) => ({
        name: category.category,
        id: category.id,
        hasSubmenu: category.subCategories && category.subCategories.length > 0,
      }))
    : [];

  return {
    categoriesData,
    processedCategories,
    error,
    isLoading,
  };
};

export type { Category, SubCategory, ProcessedCategory };

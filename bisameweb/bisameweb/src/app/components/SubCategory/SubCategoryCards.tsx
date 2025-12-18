"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useBuySellData } from "../BuySellMenu/useBuySellData";
import { BiShapePolygon } from "react-icons/bi";

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

interface BuySellSubMenuProps {
  categoryName: string;
  categoryData?: Category;
  category: string;
}

const SubCategoryCards: React.FC<BuySellSubMenuProps> = ({
  categoryName,
  categoryData,
  category,
}) => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Only fetch data if categoryData is not provided
  const { categoriesData, error, isLoading } = useBuySellData();

  useEffect(() => {
    // If categoryData is directly provided, use it
    if (categoryData && categoryData.subCategories) {
      setSubCategories(categoryData.subCategories);
      return;
    }

    // Otherwise use data from the SWR fetch
    if (categoriesData) {
      const selectedCategory = categoriesData.find(
        (category: Category) => category.category === categoryName
      );

      if (selectedCategory && selectedCategory.subCategories) {
        setSubCategories(selectedCategory.subCategories);
      } else {
        setSubCategories([]);
      }
    }
  }, [categoriesData, categoryName, categoryData]);

  // Show loading state only if we're fetching and don't have categoryData
  if (isLoading && !categoryData) {
    return (
      <div className="w-64 bg-white shadow-xl border-l ml-2 relative z-50 rounded-sm">
        <div className="p-4">
          <p className="text-gray-500">Loading subcategories...</p>
        </div>
      </div>
    );
  }

  // Show error state only if we're fetching and don't have categoryData
  if (error && !categoryData) {
    return (
      <div className="w-64 bg-white shadow-xl border-l ml-2 relative z-50 rounded-sm">
        <div className="p-4">
          <p className="text-red-500">Error loading subcategories</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {subCategories.map((item) => {
        return (
          <Link
            key={item.id}
            href={`/SearchPage?categoryGroup=${encodeURIComponent(
              category
            )}&category=${encodeURIComponent(
              categoryName
            )}&subCategory=${encodeURIComponent(item.category)}`}
            className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center 
                               text-gray-800 font-medium shadow-sm 
                               hover:bg-orange-100 hover:text-orange-600 
                               transition-all duration-200 cursor-pointer"
          >
            <BiShapePolygon className="text-orange-500 text-2xl mb-1" />
            <span
              className="block w-full max-w-[120px] truncate text-center text-xs font-medium text-gray-700"
              title={item.category}
            >
              {item.category}
            </span>
          </Link>
        );
      })}
    </>
  );
};

export default SubCategoryCards;

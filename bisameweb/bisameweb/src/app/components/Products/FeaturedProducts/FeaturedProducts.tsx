"use client";

import { FeaturedProductsProps } from "./types";
import { useFeaturedProducts, useProductNavigation } from "./hooks";
import {
  FeaturedHeader,
  LoadingSkeleton,
  ErrorState,
  FeaturedProductGrid,
} from "./components";

const FeaturedProducts = ({
  maxProducts = 10,
  showHeader = true,
  showViewAllLink = true,
}: FeaturedProductsProps) => {
  const { products, error, isLoading } = useFeaturedProducts(maxProducts);
  const { handleProductClick } = useProductNavigation();

  if (isLoading) {
    return <LoadingSkeleton count={maxProducts} />;
  }

  if (error) {
    return <ErrorState />;
  }
  
  return (
    <div className="w-full bg-white mx-auto px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 sm:py-6 md:py-8">
      {showHeader && <FeaturedHeader showViewAllLink={showViewAllLink} />}
      <FeaturedProductGrid
        products={products}
        onProductClick={handleProductClick}
      />
    </div>
  );
};

export default FeaturedProducts;

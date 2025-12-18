"use client";

import { LatestListingsProps } from "./types";
import { useLatestListings, useProductNavigation } from "./hooks";
import {
  LatestListingsHeader,
  LoadingSkeleton,
  ErrorState,
  LatestListingsProductGrid,
} from "./components";

const LatestListings = ({
  maxProducts = 10,
  showHeader = true,
  showViewAllLink = true,
}: LatestListingsProps) => {
  const { products, error, isLoading } = useLatestListings(maxProducts);
  const { handleProductClick } = useProductNavigation();

  if (isLoading) {
    return <LoadingSkeleton count={maxProducts} />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="w-full bg-white mx-auto px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 sm:py-6 md:py-8">
      {showHeader && <LatestListingsHeader showViewAllLink={showViewAllLink} />}
      <LatestListingsProductGrid
        products={products}
        onProductClick={handleProductClick}
      />
    </div>
  );
};

export default LatestListings;

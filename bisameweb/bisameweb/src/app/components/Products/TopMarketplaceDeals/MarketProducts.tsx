"use client";

import { TopMarketplaceDealsProps } from "./types";
import { useTopMarketplaceDeals, useProductNavigation } from "./hooks";
import {
  TopMarketplaceDealsHeader,
  LoadingSkeleton,
  ErrorState,
  TopMarketplaceDealsProductGrid,
} from "./components";

const TopMarketplaceDeals = ({
  maxProducts = 10,
  showHeader = true,
  showViewAllLink = true,
}: TopMarketplaceDealsProps) => {
  const { products, error, isLoading } = useTopMarketplaceDeals(maxProducts);
  const { handleProductClick } = useProductNavigation();

  if (isLoading) {
    return <LoadingSkeleton count={maxProducts} />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="w-full bg-white mx-auto px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 sm:py-6 md:py-8">
      {showHeader && <TopMarketplaceDealsHeader showViewAllLink={showViewAllLink} />}
      <TopMarketplaceDealsProductGrid
        products={products}
        onProductClick={handleProductClick}
      />
    </div>
  );
};

export default TopMarketplaceDeals;

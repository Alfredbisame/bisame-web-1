"use client";

import { LocalServicesProps } from "./types";
import { useLocalServices, useProductNavigation } from "./hooks";
import {
  LocalServicesHeader,
  LoadingSkeleton,
  ErrorState,
  LocalServicesProductGrid,
} from "./components";

const LocalServices = ({
  maxProducts = 10,
  showHeader = true,
  showViewAllLink = true,
  products: externalProducts,
  isLoading: externalIsLoading,
  error: externalError,
}: LocalServicesProps) => {
  // Only fetch data internally if external products are not provided
  const shouldFetchInternal = !externalProducts;
  const internalData = useLocalServices(maxProducts, { skip: !shouldFetchInternal });
  const { handleProductClick } = useProductNavigation();

  const { products, error, isLoading } = externalProducts 
    ? { products: externalProducts, error: externalError, isLoading: externalIsLoading || false }
    : internalData;
  
  if (isLoading) {
    return <LoadingSkeleton count={maxProducts} />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="w-full bg-white mx-auto px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 sm:py-6 md:py-8">
      {showHeader && <LocalServicesHeader showViewAllLink={showViewAllLink} />}
      <LocalServicesProductGrid
        products={products}
        onProductClick={handleProductClick}
      />
    </div>
  );
};

export default LocalServices;
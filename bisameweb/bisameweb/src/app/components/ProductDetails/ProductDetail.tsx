"use client";

import { FC } from "react";
import ProductActionButtons from "./ProductActionButtons";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorDisplay from "./ErrorDisplay";
import { useProductData } from "./hooks/useProductData";
export type { Product, ProductImage } from "./hooks/useProductData";
import ViewsAndFollow from "./ViewsAndFollow";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/hooks/useUser";
import toast from "react-hot-toast";

const ProductDetail: FC = () => {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");

  const { product, isLoading, hasError, error } = useProductData(listingId);
  const router = useRouter();
  const { user } = useUser();

  console.log(product);
  console.log(product);
  console.log(product);

  // Event handlers
  const handleChatClick = () => {
    console.log("Opening chat for product:", product?.title);
    // Chat implementation
    if (!user?.authenticated) {
      toast.success("Chat functionality requires that you are authorized");
      router.push("/UserAccounts/SignIn");
    }
  };

  const handleTradeAssuranceClick = () => {
    console.log("Opening Trade Assurance");
    // Trade assurance implementation
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (hasError || !product) {
    return (
      <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-56 sm:py-6 md:py-8">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image Section */}
        <ProductImageGallery product={product} />

        {/* Product Details Section */}
        <div className="flex-1 lg:mt-0 lg:ml-8">
          <ViewsAndFollow
            views={product?.totalViews ?? 0}
            userId={product?.userId}
            listingId={listingId}
          />
          <ProductInfo product={product} />
          <ProductActionButtons
            authenticated={user?.authenticated}
            onChatClick={handleChatClick}
            onTradeAssuranceClick={handleTradeAssuranceClick}
            phoneNumber={product?.contactNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

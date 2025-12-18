import ProductDetail from "@/app/components/ProductDetails/ProductDetail";
import ProductInformation from "@/app/components/ProductDetails/ProductInformation";
import RelatedProducts from "@/app/components/ProductDetails/RelatedProducts/RelatedProducts";
import { Suspense } from "react";
import { BottomNavigation } from "../components/BottomNavigation";

const ProductPage = () => {
  return (
    <Suspense fallback={<div>Loading product details...</div>}>
      <ProductDetail />
      <ProductInformation />
      <RelatedProducts />
      <BottomNavigation activeTab="home" />
    </Suspense>
  );
};

export default ProductPage;

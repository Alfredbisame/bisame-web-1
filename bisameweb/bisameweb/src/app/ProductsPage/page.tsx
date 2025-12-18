import React, { Suspense } from "react";
import ProductsPage from "../components/ProductPage/ProductPage";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductsPage />
    </Suspense>
  );
};

export default Page;

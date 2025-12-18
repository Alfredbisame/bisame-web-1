import React, { Suspense } from "react";
import Products from "../components/Forms/Products/Products";

const ProductsPage = () => {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <Products />
    </Suspense>
  );
};

export default ProductsPage;

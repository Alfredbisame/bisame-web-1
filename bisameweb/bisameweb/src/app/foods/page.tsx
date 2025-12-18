import React, { Suspense } from "react";
import Foods from "../components/Forms/Foods/Foods";

const FoodsPage = () => {
  return (
    <Suspense fallback={<div>Loading foods...</div>}>
      <Foods />
    </Suspense>
  );
};

export default FoodsPage;

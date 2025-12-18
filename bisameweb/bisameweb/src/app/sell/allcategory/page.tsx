import React, { Suspense } from "react";
import ServiceFormContainer from "./components/ServiceFormContainer";

const AllCategory = () => {
  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <div className="post-category-page">
        <ServiceFormContainer />
      </div>
    </Suspense>
  );
};

export default AllCategory;

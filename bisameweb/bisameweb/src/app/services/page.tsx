import React, { Suspense } from "react";
import Service from "../components/Forms/Services/UnifiedService/Service";

const ServicePage = () => {
  return (
    <Suspense fallback={<div>Loading services...</div>}>
      <Service />
    </Suspense>
  );
};

export default ServicePage;

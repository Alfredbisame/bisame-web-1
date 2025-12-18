import React, { Suspense } from "react";
import Health from "../components/Forms/Health/Health";

const HealthPage = () => {
  return (
    <Suspense fallback={<div>Loading health...</div>}>
      <Health />
    </Suspense>
  );
};

export default HealthPage;

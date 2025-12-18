import React, { Suspense } from "react";
import Jobs from "../components/Forms/Jobs/Jobs";

const JobsPage = () => {
  return (
    <Suspense fallback={<div>Loading jobs...</div>}>
      <Jobs />
    </Suspense>
  );
};

export default JobsPage;

import React, { Suspense } from "react";
import JobSeekers from "../components/Forms/JobSeekers/JobSeekers";

const JobSeekerPage = () => {
  return (
    <Suspense fallback={<div>Loading job seekers...</div>}>
      <JobSeekers />
    </Suspense>
  );
};

export default JobSeekerPage;

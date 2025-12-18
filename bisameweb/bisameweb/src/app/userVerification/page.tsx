"use client";
import { Suspense } from "react";
import VerificationForm from "../components/Authenticate/VerificationForm";

const UserVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <VerificationForm />
    </Suspense>
  );
};

export default UserVerificationPage;

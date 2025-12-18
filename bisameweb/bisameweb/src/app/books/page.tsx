import React, { Suspense } from "react";
import Books from "../components/Forms/Books/Books";

const BooksPage = () => {
  return (
    <Suspense fallback={<div>Loading books...</div>}>
      <Books />
    </Suspense>
  );
};

export default BooksPage;

import React from "react";

interface SavedProductsHeaderProps {
  productsCount: number;
}

const SavedProductsHeader: React.FC<SavedProductsHeaderProps> = ({
  productsCount,
}) => {
  const isSingle = productsCount === 1;

  return (
    <header className="mb-10">
      {/* Title Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 relative w-fit">
          Saved Products
          {/* Accent underline */}
          <span className="absolute left-0 -bottom-1 w-10 h-1 rounded-full bg-orange-500/70"></span>
        </h1>

        {/* Count badge */}
        <span
          className="
          px-3 py-1.5 text-sm font-medium 
          rounded-full bg-orange-50 text-orange-700 
          border border-orange-200 shadow-sm
        "
        >
          {productsCount} {isSingle ? "item" : "items"}
        </span>
      </div>

      {/* Subtitle */}
      <p className="mt-3 text-gray-600 text-sm sm:text-base">
        These are products you’ve saved for later. You can revisit or manage
        them anytime.
      </p>
    </header>
  );
};

export default SavedProductsHeader;

import { LoadingSkeletonProps } from "../types";

const LoadingSkeleton = ({ count = 8 }: LoadingSkeletonProps) => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-52 lg:px-56 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Latest Listings</h1>
        <div className="animate-pulse bg-gray-200 rounded w-24 sm:w-36 md:w-48 h-4 sm:h-6" />
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 md:gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="border p-2 sm:p-4 animate-pulse rounded">
            <div className="aspect-square w-full bg-gray-200 mb-2" />
            <div className="h-4 bg-gray-200 mb-2" />
            <div className="h-4 bg-gray-200 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton; 
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import axios from "axios";
import { getApiConfig } from "@/app/utils/apiConfig";
import AllProducts from "../components/Products/AllProducts ";
import SearchSort from "../components/Products/SearchSort";
// import FilterCategory from '../components/ShopSideBar/FilterCategory';
import FilterPage from "../components/ShopSideBar/FilterPage";
import PopularBrands from "../components/ShopSideBar/PopularBrands";
import PopularTags from "../components/ShopSideBar/PopularTags";
import PriceRange from "../components/ShopSideBar/PriceRange";
import useShowFilter from "../ProductsPage/hooks/useShowFilter";
import FilterOptions from "../components/Products/FilterOptions";
import { BottomNavigation } from "../components/BottomNavigation";

// Define interfaces
interface ListingImage {
  imageUrl: string;
  id: string;
}

interface UserInfo {
  name: string;
  profilePicture: string;
}

// interface ListingAttributes {
//   [key: string]: any;
// }

interface SearchResult {
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  location: string;
  images: ListingImage[];
  userInfo: UserInfo;
  attributes: object;
  city: string;
  region: string;
  childCategory: string;
  contactNumber: string;
  totalViews: number;
  userId: string;
  isPromoted: boolean;
  status: string;
  message: string;
  negotiable: boolean;
  __v: number;
  _textScore: number;
  textScoreNorm: number;
  finalScore: number;
}

interface SearchResponse {
  code: number;
  data: {
    results: SearchResult[];
    totalCount: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
  message: string;
}

interface BuySellStructure {
  categoryGroup: string | "";
  category: string | "";
  subCategory: string | "";
}

// SWR fetcher function
const fetcher = async (url: string): Promise<SearchResponse> => {
  const response = await axios.get(url);
  return response.data;
};

// Search Results Component
const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchBuySell, setSearchBuySell] = useState<BuySellStructure>({
    category: "",
    categoryGroup: "",
    subCategory: "",
  });
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(16);
  const { showFilter, handleShowFilter } = useShowFilter();

  // Extract search parameters
  useEffect(() => {
    // ... existing useEffect logic ...
    const query = searchParams.get("query") || searchParams.get("q") || "";
    const categoryGroup = searchParams.get("categoryGroup") as string;
    const category = searchParams.get("category") as string;
    const subCategory = searchParams.get("subCategory") as string;

    setSearchBuySell({ category, categoryGroup, subCategory });

    setSearchQuery(query);
    setPage(1); // Reset to first page when query changes
    setShouldFetch(!!query.trim());
  }, [searchParams]);

  const { endpoints } = getApiConfig();

  // Construct the API URL
  let apiUrl: string | null = null;

  if (searchBuySell.categoryGroup !== "" && !searchQuery.trim()) {
    // Buy/Sell Logic - Use listings endpoint
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      categoryGroup: searchBuySell.categoryGroup?.trim() || "",
      category: searchBuySell.category?.trim() || "",
      subCategory: searchBuySell.subCategory?.trim() || ""
    });
    apiUrl = `${endpoints.listings}?${params.toString()}`;
  } else if (shouldFetch && searchQuery.trim()) {
    // Search Logic - Use search endpoint
    const params = new URLSearchParams({
      query: searchQuery.trim(),
      page: page.toString(),
      pageSize: pageSize.toString()
    });
    apiUrl = `${endpoints.search}?${params.toString()}`;
  }

  // Use SWR for data fetching
  const { data, error, isLoading, mutate } = useSWR<SearchResponse>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      dedupingInterval: 5000,
    }
  );

  console.log(data);

  // Extract products from response
  const products = data?.data?.results || [];
  const totalCount = data?.data?.totalCount || 0;
  const totalPages = data?.data?.totalPages || 0;
  const currentPage = data?.data?.page || 1;

  const hasSearchQuery = !!searchQuery.trim();
  const hasError = !!error;
  const hasNoResults =
    hasSearchQuery && !isLoading && !hasError && products.length === 0;

  console.log("Search Debug:", {
    searchQuery,
    shouldFetch,
    apiUrl,
    isLoading,
    error: error?.message,
    productsCount: products.length,
    totalCount,
    totalPages,
    currentPage,
  });

  // Loading component
  if (isLoading && (hasSearchQuery || searchBuySell)) {
    return (
      <main className="min-h-screen">
        <div className="flex flex-col lg:flex-row gap-4 p-3 lg:px-14 xl:px-20 2xl:px-52">
          {/* <FilterCategory /> */}
          <FilterOptions
            showFilter={showFilter}
            handleShowFilter={handleShowFilter}
          />

          <div className="flex-1">
            <SearchSort />
            <FilterPage productCount={totalCount} />
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600 text-sm md:text-base">
                  Searching for &quot;{searchQuery}&quot;...
                </p>
              </div>
            </div>
          </div>
          <BottomNavigation />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-4 p-3 lg:px-14 xl:px-20 2xl:px-52">
        <FilterOptions
          showFilter={showFilter}
          handleShowFilter={handleShowFilter}
        />
        <div className="w-full lg:w-3/4">
          <SearchSort handleShowFilter={handleShowFilter} />

          {/* Search Results Header */}
          <div className="max-w-5xl mb-4 md:ml-6 p-2 bg-gray-100 rounded-sm">
            {hasSearchQuery && (
              <div className="mb-2">
                <h1 className="md:text-xl font-semibold text-gray-800">
                  Search Results for &quot;{searchQuery}&quot;
                </h1>
                <p className="text-sm text-gray-600">
                  {isLoading ? "Searching..." : `${totalCount} results found`}
                </p>
              </div>
            )}

            {hasError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-semibold">Search Error:</p>
                <p>
                  {error.message ||
                    "An error occurred while searching. Please try again."}
                </p>
                <button
                  onClick={() => mutate()}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Retry Search
                </button>
              </div>
            )}
          </div>

          <FilterPage productCount={data?.data.totalCount} />

          {/* Search Results or Empty States */}
          {!(hasSearchQuery || searchBuySell) ? (
            <div className="text-center py-12">
              <h2 className="md:text-2xl text-red-500 font-semibold mb-4">
                No search query provided
              </h2>
              <p className="text-gray-500">
                Please use the search bar to find products and services.
              </p>
            </div>
          ) : hasNoResults ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                No results found for &quot;{searchQuery}&quot;
              </h2>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or filters to find what
                you&apos;re looking for.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Search suggestions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your spelling</li>
                  <li>Try more general keywords</li>
                  <li>Try different location settings</li>
                  <li>Remove some filters</li>
                </ul>
              </div>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="my-4 pl-8 text-sm text-orange-500 font-bold">
                Showing {products.length} of {totalCount} results
              </div>
              <AllProducts
                products={products}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="h-60 w-full flex items-center justify-center">
              <span className="text-orange-500 font-semibold">
                No result found
              </span>
            </div>
          )}
        </div>
        <BottomNavigation />
      </div>
    </main>
  );
};

// Main Page Component with Suspense
const Page: React.FC = () => {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen">
          <div className="flex gap-4 p-4 px-52">
            <div className="w-1/3">
              {/* <FilterCategory /> */}
              <PriceRange />
              <PopularBrands />
              <PopularTags />
            </div>
            <div className="w-2/3">
              <SearchSort />
              <FilterPage productCount={0} />
              <div className="flex justify-center items-center h-64">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <SearchResults />
    </Suspense>
  );
};

export default Page;

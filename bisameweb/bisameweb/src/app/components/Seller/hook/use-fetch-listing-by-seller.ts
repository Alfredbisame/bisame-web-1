import { fetcher } from "@/app/Messages/utils";
import { useEffect } from "react";
import useSWR from "swr";
import { SellerListing } from "../SellerAdsGrid";

// Shape of the API "data" object for listings by seller
// export interface SellerListing {
//   id: string;
//   contactNumber?: string;
//   location?: string;
//   userInfo?: {
//     name?: string;
//     [key: string]: unknown;
//   };
//   [key: string]: unknown;
// }

export interface ListingsBySellerData {
  results: SellerListing[];
  totalCount: number;
  totalPages: number;
}

interface ListingsBySellerResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

const useFetchListingsBySeller = <T = ListingsBySellerData>(
  sellerId: string,
  page: number,
  pageSize = 10
) => {
  const apiUrl =
    sellerId && page > 0
      ? `/api/all-listings-by-seller?page=${page}&pageSize=${pageSize}&userId=${sellerId}`
      : null;

  const jsonFetcher = async (
    url: string
  ): Promise<ListingsBySellerResponse<T>> => {
    const res = await fetcher(url);

    if (!res) {
      throw new Error("No response from fetcher");
    }

    // If your fetcher already returns JSON
    if (!(res instanceof Response)) {
      return res as ListingsBySellerResponse<T>;
    }

    const json = (await res.json()) as ListingsBySellerResponse<T>;
    return json;
  };

  const {
    data: productData,
    isLoading: isLoadingProduct,
    mutate: refresh,
    error,
  } = useSWR<ListingsBySellerResponse<T>>(apiUrl, jsonFetcher);

  useEffect(() => {
    if (sellerId && page && refresh) {
      void refresh();
    }
  }, [sellerId, page, refresh]);

  const newProductData = productData?.data as T | undefined;

  return { newProductData, isLoadingProduct, error };
};

export default useFetchListingsBySeller;

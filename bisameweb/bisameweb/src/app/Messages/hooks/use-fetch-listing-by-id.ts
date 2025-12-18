import useSWR from "swr";
import { fetcher } from "../utils";

const useFetchListingById = (listingId: string) => {
  const apiUrl = `/api/listingById?id=${encodeURIComponent(listingId)}`;
  const { data: listingByIdData, isLoading, error } = useSWR(apiUrl, fetcher);
  return { listingByIdData, isLoading, error };
};

export default useFetchListingById;

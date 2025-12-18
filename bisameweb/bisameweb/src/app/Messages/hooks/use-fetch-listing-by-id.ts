import useSWR from "swr";
import axios from "axios";
import { getApiConfig } from "@/app/utils/apiConfig";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useFetchListingById = (listingId: string) => {
  const { endpoints } = getApiConfig();
  const apiUrl = endpoints.listingDetails(listingId);
  const { data: listingByIdData, isLoading, error } = useSWR(apiUrl, fetcher);
  return { listingByIdData, isLoading, error };
};

export default useFetchListingById;

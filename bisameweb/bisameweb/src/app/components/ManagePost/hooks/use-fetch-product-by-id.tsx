import { useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { getApiConfig } from "@/app/utils/apiConfig";

type ListingDetailsResponse<T = unknown> = {
  data: T;
  message?: string;
  success?: boolean;
};

const useFetchProductById = <T = unknown,>(productId: string) => {
  const { endpoints } = getApiConfig();
  const apiUrl = productId ? endpoints.listingDetails(productId) : null;

  const jsonFetcher = async (url: string): Promise<ListingDetailsResponse<T>> => {
    const res = await axios.get(url);
    return res.data as ListingDetailsResponse<T>;
  };

  const {
    data: productData,
    isLoading: isLoadingProduct,
    mutate: refresh,
  } = useSWR<ListingDetailsResponse<T>>(apiUrl, jsonFetcher);

  useEffect(() => {
    if (productId) {
      void refresh();
    }
  }, [productId, refresh]);

  const newProductData = productData?.data;

  return { newProductData, isLoadingProduct };
};

export default useFetchProductById;

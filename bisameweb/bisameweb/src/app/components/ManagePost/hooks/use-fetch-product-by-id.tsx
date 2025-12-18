import { fetcher } from "@/app/Messages/utils";
import { useEffect } from "react";
import useSWR from "swr";

type ListingDetailsResponse<T = unknown> = {
  data: T;
  message?: string;
  success?: boolean;
};

const useFetchProductById = <T = unknown,>(productId: string) => {
  const apiUrl = productId ? `/api/listing-details?id=${productId}` : null;

  const jsonFetcher = async (
    url: string
  ): Promise<ListingDetailsResponse<T>> => {
    const res = await fetcher(url); // typed as Promise<Response | undefined>

    if (!res) {
      throw new Error("No response from server");
    }

    if (res instanceof Response) {
      const json = (await res.json()) as unknown;
      return json as ListingDetailsResponse<T>;
    }

    return res as unknown as ListingDetailsResponse<T>;
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

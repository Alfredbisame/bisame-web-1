import axios from "axios";
import useSWR from "swr";
import { Promotion } from "../types";
import { getApiConfig } from "@/app/utils/apiConfig";

export type categoryGroupType = "Buy and Sell" | "Services";

interface ImageProps {
  id: string;
  imageUrl: string;
}

const fetcher = async (url: string) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const response = await axios.get(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      }
    });

    if (!response.data) {
      throw new Error("Error occurred fetching data");
    }

    return response.data?.data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const useProfilePromotion = () => {
  const { endpoints } = getApiConfig();
  const apiUrl = endpoints.profilePromotions;

  const { data, error, isLoading, mutate } = useSWR<Promotion[]>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 3600000,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate
  };
};

export default useProfilePromotion;

"use client";
import axios from "axios";
import useSWR from "swr";
import { NewPromotionPlanData } from "../interfaces";

const useFetchPromotion = (category: string) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get(url);
      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.message);
      } else if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
      return null;
    }
  };

  const { data, error, isLoading } = useSWR<NewPromotionPlanData>(
    `/api/promotions/?group=${encodeURIComponent(category)}`,
    fetcher,
    {
      refreshWhenOffline: false,
      errorRetryCount: 3,
      revalidateIfStale: false,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useFetchPromotion;

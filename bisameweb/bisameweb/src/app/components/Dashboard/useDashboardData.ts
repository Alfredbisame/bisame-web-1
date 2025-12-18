import useSWR from "swr";
import { DashboardData } from "@/app/components/Dashboard/types";
import axios from "axios";

// Simple fetcher that relies on cookies for auth
const fetcher = async (url: string): Promise<DashboardData> => {
  // const res = await fetch(url, {
  //   credentials: "include", // Ensure cookies are sent
  // });

  // if (!res.ok) {
  //   const errData = await res.json().catch(() => ({}));
  //   throw new Error(errData.message || "Failed to fetch dashboard data.");
  // }

  // return res.json();

  const response = await axios.get(url, { withCredentials: true });
  return response.data;
};

export function useDashboardData() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData, Error>(
    "/api/Dashboard",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onErrorRetry: (_err, _key, _config, revalidate, { retryCount }) => {
        if (retryCount < 3) {
          setTimeout(() => revalidate({ retryCount }), 1000);
        }
      },
    }
  );

  return {
    data,
    loading: isLoading,
    error,
    mutate,
  };
}

import useSWR from "swr";
import { AffiliateResponse, RevenueData, AffiliateEarningItem } from "./types";
import axios from "axios";
import toast from "react-hot-toast";

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);

    if (response.status === 404) {
      toast.error(response.data.message);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export function useAffiliateData() {
  const { data, error, isLoading } = useSWR(
    "/api/Dashboard/MakeMoney",
    fetcher,
    {
      dedupingInterval: 2 * 60 * 60 * 1000, // 2 hours
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  console.log(data);

  let mapped: AffiliateResponse | null = null;
  let revenueData: RevenueData[] = [];

  if (data) {
    mapped = {
      affiliate: data.affiliate || [],
      earnings: data.earnings || [],
      invitecode: data.invitecode || "",
    };
    // Map earnings to RevenueData[]
    if (Array.isArray(data.earnings)) {
      revenueData = data.earnings.map(
        (item: AffiliateEarningItem, idx: number) => ({
          id: idx + 1,
          affiliateName: item.name || "",
          totalAffiliates: 0, // Not present in API, set to 0 or map if available
          direct: parseFloat((item.Direct || "0").replace(",", ".")),
          indirect: parseFloat((item.Indirect || "0").replace(",", ".")),
          total: parseFloat((item.total || "0").replace(",", ".")),
          status: "Pending", // Default status, or map if available
        })
      );
    }
  }

  return {
    data: mapped,
    revenueData,
    loading: isLoading,
    error: error ? error.message : null,
  };
}

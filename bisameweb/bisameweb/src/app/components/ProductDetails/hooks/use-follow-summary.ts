import { fetcher } from "@/app/Messages/utils";
import useSWR from "swr";

interface FollowSummaryResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

const useFollowSummary = <T = unknown>(userId: string) => {
  const apiUrl = userId ? `/api/followSummary?id=${userId}` : null;

  const jsonFetcher = async (
    url: string
  ): Promise<FollowSummaryResponse<T>> => {
    const res = await fetcher(url);

    // CASE 1 — fetcher returned undefined → return safe empty structure
    if (!res) {
      return {
        data: undefined as unknown as T,
        message: "No response",
        success: false,
      };
    }

    if (!(res instanceof Response)) {
      return res as unknown as FollowSummaryResponse<T>;
    }


    const json = (await res.json()) as unknown as FollowSummaryResponse<T>;
    return json;
  };

  const { data, isLoading } = useSWR<FollowSummaryResponse<T>>(
    apiUrl,
    jsonFetcher
  );

  return {
    newFollowData: data?.data,
    isLoadingFollow: isLoading,
  };
};

export default useFollowSummary;

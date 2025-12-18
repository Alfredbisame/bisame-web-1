import axios from "axios";
import useSWR from "swr";
import { getApiConfig } from "@/app/utils/apiConfig";

const usePopularData = () => {
  const fetcher = async () => {
    try {
      const { endpoints } = getApiConfig();
      const response = await axios.get(endpoints.popularSearch);
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { data } = useSWR("popularSearch", fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: false,
    revalidateIfStale: false,
    refreshInterval: 0,
    dedupingInterval: Infinity,
  });

  const getData: string[] = data?.data;

  console.log(data);

  return { getData };
};

export default usePopularData;

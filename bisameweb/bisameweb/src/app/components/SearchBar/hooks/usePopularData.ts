import axios from "axios";
import useSWR from "swr";

const usePopularData = () => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get(url);
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { data } = useSWR("/api/popularSearch", fetcher, {
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

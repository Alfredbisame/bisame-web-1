import axios from "axios";
import toast from "react-hot-toast";
import useSWR from "swr";

const useFetchFormOptions = (
  group: string,
  category?: string,
  subCategory?: string
) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get(url);
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  //Run checks for Job Seekers and modify it
  const checkGroup = group === "jobseek" ? "Job Seekers" : group;

  let apiUrl;
  console.log(checkGroup);

  console.log(checkGroup);

  switch (checkGroup) {
    case "health":
    case "Job Seekers":
      apiUrl = `/api/formOptions?category=${encodeURIComponent(
        category as string
      )}&group=${encodeURIComponent(checkGroup)}`;
      break;
    case "Buy and Sell":
      apiUrl = `/api/formOptions?category=${encodeURIComponent(
        category as string
      )}&subCategory=${encodeURIComponent(
        subCategory as string
      )}&group=${encodeURIComponent(checkGroup)}`;
      break;
    default:
      apiUrl = `/api/formOptions?group=${encodeURIComponent(checkGroup)}`;
      break;
  }

  console.log(apiUrl);

  const { data, error, isLoading, mutate: refresh } = useSWR(apiUrl, fetcher);

  return { data, error, isLoading, refresh };
};

export default useFetchFormOptions;

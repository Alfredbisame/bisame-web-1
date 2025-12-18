import axios from "axios";
import { PromoPlanRoot } from "../interfaces";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";

const useCheckout = (postData: PromoPlanRoot) => {
  const router = useRouter();
  const fetcher = async (url: string) => {
    try {
      const response = await axios.post(url, postData);
      if (response.data) {
        toast.success(response.data.message || "Purchase successful");
        router.push("/dashboard/purchases");
        return response.data.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { trigger, data, error, isMutating } = useSWRMutation(
    `/api/purchasePromo`,
    fetcher
  );

  return { trigger, data, isMutating, error };
};

export default useCheckout;

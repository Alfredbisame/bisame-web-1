import axios from "axios";
import useSWR from "swr";
import { Promotion } from "../types";

export type categoryGroupType = "Buy and Sell" | "Services";

interface ImageProps {
  id: string;
  imageUrl: string;
}

// export interface ProfileListings {
//   id: string;
//   title: string;
//   location: string;
//   price: number;
//   description: string;
//   images: ImageProps[];
// }

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    if (!response.data) {
      throw new Error("Error occurred fetching data");
    }

    return response.data?.data.results;
  } catch (error) {
    console.error(error);
  }
};

const useProfilePromotion = () => {
  const apiUrl = `/api/profilePromotion`;

  const { data, error, isLoading, mutate } = useSWR<Promotion[]>(
    apiUrl,
    fetcher
  );

  return { data, error, isLoading, mutate };
};

export default useProfilePromotion;

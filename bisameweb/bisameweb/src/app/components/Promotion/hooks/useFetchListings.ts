import axios from "axios";
import useSWR from "swr";
import { getApiConfig } from "@/app/utils/apiConfig";

export type categoryGroupType = "Buy and Sell" | "Services";

interface ImageProps {
  id: string;
  imageUrl: string;
}

export interface ProfileListings {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  images: ImageProps[];
}

const fetcher = async ({ url, categoryGroup }: { url: string; categoryGroup: string }) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const response = await axios.get(url, {
      params: { categoryGroup },
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

const useFetchListings = (categoryGroup: categoryGroupType | undefined) => {
  console.log(categoryGroup);
  const { endpoints } = getApiConfig();

  // Use a conditional key to avoid fetching if categoryGroup is undefined
  const key = categoryGroup ? { url: endpoints.profileListings, categoryGroup } : null;

  const { data, error, isLoading, mutate } = useSWR<ProfileListings[]>(
    key,
    fetcher
  );
  return { data, error, isLoading, mutate };
};

export default useFetchListings;

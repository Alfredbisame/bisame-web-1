import axios from "axios";
import useSWR from "swr";

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

const useFetchListings = (categoryGroup: categoryGroupType | undefined) => {
  console.log(categoryGroup);
  const apiUrl = `/api/profileListings?categoryGroup=${encodeURIComponent(
    categoryGroup as categoryGroupType
  )}`;

  const { data, error, isLoading, mutate } = useSWR<ProfileListings[]>(
    apiUrl,
    fetcher
  );
  return { data, error, isLoading, mutate };
};

export default useFetchListings;

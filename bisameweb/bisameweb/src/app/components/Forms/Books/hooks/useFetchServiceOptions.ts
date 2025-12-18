import axios from "axios";
import useSWR from "swr";
import { AllCategoriesProps } from "../Books";
import { useEffect } from "react";

interface ServicesOption {
  group: string;
  options: string[];
}

interface DataServicesProps {
  data: ServicesOption[];
}

const useFetchServiceOptions = (category: AllCategoriesProps) => {
  const fetcher = async (url: string) => {
    try {
      const response = await axios.get(url, { params: category });
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      console.log(response.data);
      const Data: DataServicesProps = response.data;

      const DataArray: string[] = [];

      for (const data of Data.data) {
        DataArray.push(data.group);
      }

      console.log(DataArray);
      console.log(Data.data);
      return DataArray;
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, isLoading, mutate } = useSWR("/api/services", fetcher);

  useEffect(() => {
    if (category.category && category.subCategory) {
      mutate(undefined, { revalidate: true });
    }
  }, [category.category, category.subCategory, mutate]);

  return { data, error, isLoading };
};

export default useFetchServiceOptions;

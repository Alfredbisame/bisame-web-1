import axios from "axios";

export const fetcher = async (url: string) => {
  try {
    const { data } = await axios.get<Response>(url);

    if (!data) {
      throw new Error("Error occurred fetching data");
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};

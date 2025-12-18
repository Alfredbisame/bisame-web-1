import axios from "axios";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useMemo } from "react";
import { ConversationProps } from "../interfaces"; // use this, don't redeclare

const fetcher = async (url: string): Promise<ConversationProps[]> => {
  try {
    const { data } = await axios.get(url);

    if (!data?.data?.results) {
      throw new Error("Invalid response format");
    }

    return data.data.results as ConversationProps[];
  } catch (error) {
    console.error("Error fetching chat contacts:", error);
    toast.error("Failed to load conversations");
    throw error;
  }
};

const useChatContact = (page = 1, pageSize = 10, sortColumn = "asc") => {
  
  const apiUrl = useMemo(
    () =>
      `/api/chatContacts?page=${encodeURIComponent(
        page
      )}&pageSize=${encodeURIComponent(
        pageSize
      )}&sortColumn=${encodeURIComponent(sortColumn)}`,
    [page, pageSize, sortColumn]
  );

  
  const {
    data: chatContactsData,
    error: chatContactsError,
    isLoading: isLoadingChatContacts,
    mutate,
  } = useSWR<ConversationProps[]>(apiUrl, fetcher, {
    refreshInterval: 5000,
    dedupingInterval: 2000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    keepPreviousData: true,
    revalidateIfStale: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  });

  return {
    chatContactsData,
    chatContactsError,
    isLoadingChatContacts,
    mutate,
  };
};

export default useChatContact;

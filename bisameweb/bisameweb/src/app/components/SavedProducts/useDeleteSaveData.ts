import axios from "axios";
import useSWRMutation from "swr/mutation";

interface DeleteSaveResult {
  success: boolean;
  message: string;
  [key: string]: unknown;
}

async function deleteSaveFetcher(url: string): Promise<DeleteSaveResult> {
  const response = await axios.delete(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = response.data;
  return data;
}

export function useDeleteSaveData(deleteId: string) {
  const {
    trigger: deleteSave,
    isMutating: loading,
    error,
    data: result,
    reset,
  } = useSWRMutation(
    `/api/Dashboard/Saved/DeleteSave?deleteId=${encodeURIComponent(deleteId)}`,
    deleteSaveFetcher
  );

  return {
    deleteSave,
    loading,
    error,
    result,
    reset,
  };
}

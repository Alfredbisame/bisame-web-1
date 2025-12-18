import { useCallback, useState, useEffect } from "react";
import { useSavedData } from "../../SavedProducts/useSavedData";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import toast from "react-hot-toast";

const ADD_FAVORITE_API = "/api/Dashboard/Saved/AddFavorite";
const DELETE_FAVORITE_API = "/api/Dashboard/Saved/DeleteFavorite";

async function addFavoriteFetcher(
  url: string,
  { arg }: { arg: { id: string } }
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: arg.id }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to add to favorites.");
  }
  return data;
}

async function deleteFavoriteFetcher(
  url: string,
  { arg }: { arg: { favoriteId: string } }
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favoriteId: arg.favoriteId }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to remove from favorites.");
  }
  return data;
}

export function useSave(listingId: string | null) {
  const { data, loading: loadingSavedData, error } = useSavedData();

  // Local state for isSaved based on the saved data from API
  const [isSaved, setIsSaved] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.products && listingId) {
      console.log(data.products)
      console.log(data.products)
      // Check if the current listing is in the saved products list
      const savedProduct = data.products.find(
        (product) => product.favoriteId === listingId
      );
      console.log(savedProduct)
      if (savedProduct) {
        setIsSaved(true);
        setFavoriteId(savedProduct.favoriteId || null);
      } else {
        setIsSaved(false);
        setFavoriteId(null);
      }
    } else {
      setIsSaved(false);
      setFavoriteId(null);
    }
  }, [data, listingId]);

  const { trigger: addTrigger, isMutating: isAdding } = useSWRMutation(
    ADD_FAVORITE_API,
    addFavoriteFetcher
  );
  const { trigger: deleteTrigger, isMutating: isDeleting } = useSWRMutation(
    DELETE_FAVORITE_API,
    deleteFavoriteFetcher
  );
  const [lastSaveError, setLastSaveError] = useState<string | null>(null);

  const toggleSave = useCallback(async () => {
    if (!listingId) return;

    try {
      if (isSaved) {
        // Remove from favorites
        if (!favoriteId) {
          throw new Error("Favorite ID not found");
        }
        await deleteTrigger({ favoriteId });
        setIsSaved(false);
        setFavoriteId(null);
        toast.success("Removed from saved items.");
      } else {
        // Add to favorites
        await addTrigger({ id: listingId });
        setIsSaved(true);
        toast.success("Added to saved items.");
      }

      // Revalidate the saved data
      await mutate("/api/Dashboard/Saved");

      setLastSaveError(null);
    } catch (err: unknown) {
      setLastSaveError(
        (err as Error).message || "Network error. Please try again."
      );
      toast.error((err as Error).message || "Network error. Please try again.");
    }
  }, [listingId, isSaved, favoriteId, addTrigger, deleteTrigger]);

  return {
    isSaved,
    toggleSave,
    loading: isAdding || isDeleting || loadingSavedData,
    error,
    lastSaveError,
  };
}

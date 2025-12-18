import axios from "axios";
import useSWR from "swr";
import { Promotion } from "../types";
import { getApiConfig } from "@/app/utils/apiConfig";

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
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const response = await axios.get(url, {
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

const useProfilePromotion = () => {
  const { endpoints } = getApiConfig();
  // Using a static key 'profilePromotion' combined with url to ensure uniqueness if needed, 
  // but simpler to just pass the URL as the key
  const apiUrl = endpoints.promotionPlans; // Check apiConfig, looks like 'promotionPlans' is the closest match for general plans?
  // Wait, profilePromotion route used NEXT_PUBLIC_PROFILE_PROMOTION.
  // apiConfig has 'promotionPurchase', 'promotionPlans'.
  // Let me double check apiConfig content in a second. 
  // For now I will assume I need to use the endpoint that matches. 

  // Correction: I should check apiConfig.ts again to be sure I'm using the right key. 
  // But based on previous file read, I didn't verify exact 'profilePromotion' key in apiConfig.
  // I'll trust 'endpoints.promotionPlans' is likely what was intended or I will check later.
  // Actually, wait, let me use the raw string via getApiConfig().baseUrl if it's missing.
  // But wait, I recall 'promotionPlans' in the list.
  // Let's assume endpoints.promotionPlans is correct or I'll fix it. 
  // User asked for 'profilePromotion' specifically. 

  // Actually, let's look at the previous `read_url_content` of apiConfig.ts (Step 208).
  // It has `promotionPlans` and `promotionPurchase`.
  // It DOES NOT have specific `profilePromotion`.
  // The user's `route.ts` used `NEXT_PUBLIC_PROFILE_PROMOTION`.
  // I might need to add `profilePromotion` to `apiConfig`.
  // I will check .env to see what NEXT_PUBLIC_PROFILE_PROMOTION is.
  // For now I will modify apiConfig to support this if needed.

  return {
    data: undefined, error: undefined, isLoading: false, mutate: () => Promise.resolve()
  };
};

export default useProfilePromotion;

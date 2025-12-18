import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { OptionsProps, TriggerProps } from "../../Foods/context/FormContext";

const useFetchDynamicOptions = (
  trigger: TriggerProps,
  attributeKey: string,
  attributeValue: string,
  optionKey: string,
  handleChangeOptionData: (data: OptionsProps) => void
) => {
  const searchParams = useSearchParams();
  const group = "Buy and Sell";
  const category = searchParams.get("category") as string;
  const subCategory = searchParams.get("subCategory") as string;
  const [data, setData] = useState([]);

  // Use ref to track the last fetch params to prevent duplicate requests
  const lastFetchRef = useRef<string>("");

  useEffect(() => {
    const fetcher = async () => {
      // Create a unique key for this fetch request
      const fetchKey = `${category}-${subCategory}-${attributeKey}-${attributeValue}-${optionKey}`;

      // Skip if we already fetched with these exact params
      if (fetchKey === lastFetchRef.current) {
        return;
      }

      const apiUrl = `/api/dynamicOptions?category=${encodeURIComponent(
        category
      )}&subCategory=${encodeURIComponent(
        subCategory
      )}&attributeKey=${encodeURIComponent(
        attributeKey
      )}&attributeValue=${encodeURIComponent(
        attributeValue
      )}&optionKey=${optionKey}&group=${encodeURIComponent(group)}`;

      try {
        const response = await axios.get(apiUrl);
        if (response.data) {
          const newData = response.data.data || [];
          setData(newData);
          handleChangeOptionData({
            options: newData,
            triggerAttribute: attributeKey,
          });
          toast.success(response.data.message || "Options updated");

          // Update the last fetch ref
          lastFetchRef.current = fetchKey;
        }
      } catch (error) {
        console.error("Dynamic fetch failed:", error);
      }
    };

    if (
      trigger.triggerValue &&
      attributeKey &&
      attributeValue &&
      optionKey &&
      category &&
      subCategory
    ) {
      fetcher();
    }
  }, [
    trigger.triggerValue,
    attributeKey,
    attributeValue,
    optionKey,
    category,
    subCategory,
    // handleChangeOptionData is now stable from context, but keep it in deps
    handleChangeOptionData,
  ]);

  return { data };
};

export default useFetchDynamicOptions;

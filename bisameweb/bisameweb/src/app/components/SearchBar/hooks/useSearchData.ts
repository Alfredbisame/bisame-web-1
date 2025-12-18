import { useState, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "../types"; // 👈 import your result type

interface UseSearchDataOptions {
  defaultLocation?: string;
  navigateOnSearch?: boolean;
  onSearchResults?: (results: SearchResult[]) => void; // 👈 fix here
  onSearchError?: (error: string) => void;
}

export const useSearchData = ({
  defaultLocation: _defaultLocation, // currently unused
  navigateOnSearch,
  onSearchResults: _onSearchResults, // currently unused, but typed correctly
  onSearchError,
}: UseSearchDataOptions) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSuggestionsVisible, setIsSuggestionsVisible] =
    useState<boolean>(false);
  const [manualError, setManualError] = useState<string>("");
  const router = useRouter();
  console.log(_defaultLocation);
  console.log(_onSearchResults);

  const handleInputChange = useCallback(
    (value: string) => {
      setSearchTerm(value);

      if (value.trim().length > 0) {
        setIsSuggestionsVisible(true);
      } else {
        setIsSuggestionsVisible(false);
      }

      if (manualError) {
        setManualError("");
      }
    },
    [manualError]
  );

  const performSearch = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        const errorMsg = "Please enter a search term";
        setManualError(errorMsg);
        onSearchError?.(errorMsg);
        return;
      }

      setManualError("");

      if (navigateOnSearch) {
        const searchParams = new URLSearchParams({
          query: term.trim(),
        });
        router.push(`/SearchPage?${searchParams.toString()}`);
        setIsSuggestionsVisible(false);
        return;
      }

      // If later you fetch and get SearchResult[]:
      // const results: SearchResult[] = ...
      // _onSearchResults?.(results);
    },
    [navigateOnSearch, router, onSearchError]
  );

  const handleSearch = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await performSearch(searchTerm);
    },
    [performSearch, searchTerm]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setSearchTerm(suggestion);
      setIsSuggestionsVisible(false);
      performSearch(suggestion);
    },
    [performSearch]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setIsSuggestionsVisible(false);
    setManualError("");
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    isLoading: false,
    error: manualError,
    setError: setManualError,
    isSuggestionsVisible,
    setIsSuggestionsVisible,
    handleSearch,
    handleSuggestionClick,
    handleInputChange,
    retrySearch: () => {},
    clearSearch,
    isValidating: false,
  };
};

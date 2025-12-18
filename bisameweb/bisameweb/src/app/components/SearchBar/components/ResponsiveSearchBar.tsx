"use client";

import { useState, useEffect, useRef } from "react";
import SearchSuggestions from "../SearchSuggestions";
import {
  SearchInput,
  SearchButton,
  ErrorMessage,
  MobileSearchModal,
  MobileSearchIcon,
} from "./";
import { useSearchData } from "../hooks";
import { SearchBarProps } from "../types";

const ResponsiveSearchBar: React.FC<SearchBarProps> = ({
  onSearchResults,
  onSearchError,
  placeholder = "I am looking for...",
  defaultLocation = "Ghana",
  className = "w-1/3 space-x-4",
  navigateOnSearch = true,
}) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Use custom hook for search logic (desktop)
  const {
    searchTerm,
    isLoading,
    error,
    isSuggestionsVisible,
    setIsSuggestionsVisible,
    handleSearch,
    handleSuggestionClick,
    handleInputChange,
  } = useSearchData({
    defaultLocation,
    navigateOnSearch,
    onSearchResults,
    onSearchError,
  });

  // Ref for suggestions container
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Handle search button click
  const handleSearchClick = () => {
    const form = document.getElementById("search-form") as HTMLFormElement;
    if (form) {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSuggestionsVisible(false);
      setIsMobileModalOpen(false);
      handleSearchClick();
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSuggestionsVisible]);

  return (
    <>
      {/* Desktop Search Bar - Hidden on mobile */}
      <div className={`hidden md:block ${className}`} ref={searchBarRef}>
        <form id="search-form" onSubmit={handleSearch} className="relative">
          <div className="relative">
            <SearchInput
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              hasError={!!error}
            />

            <SearchButton
              isLoading={isLoading}
              disabled={isLoading || !searchTerm.trim()}
              onClick={handleSearchClick}
            />
          </div>

          <ErrorMessage error={error} />

          {/* Search Suggestions Component */}
          {isSuggestionsVisible && (
            <SearchSuggestions
              query={searchTerm}
              isVisible={isSuggestionsVisible}
              onSuggestionClick={handleSuggestionClick}
              onClose={() => setIsSuggestionsVisible(false)}
              className="mt-1"
              maxSuggestions={200}
            />
          )}
        </form>
      </div>

      {/* Mobile Search Icon - Shown only on mobile */}
      <div className="md:hidden">
        <MobileSearchIcon
          onClick={() => setIsMobileModalOpen(true)}
          className="relative z-10"
        />
      </div>

      {/* Mobile Search Modal */}
      <MobileSearchModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onSearchResults={onSearchResults}
        onSearchError={onSearchError}
        placeholder={placeholder}
        defaultLocation={defaultLocation}
        navigateOnSearch={navigateOnSearch}
      />
    </>
  );
};

export default ResponsiveSearchBar;

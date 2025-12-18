import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSave } from "./hooks/useSave";

interface SaveIconProps {
  listingId: string | null;
  className?: string;
}

const SaveIcon: React.FC<SaveIconProps> = ({ listingId, className = "" }) => {
  const {
    isSaved,
    toggleSave,
    loading: isLoading,
    lastSaveError,
  } = useSave(listingId);

  const handleSaveClick = async () => {
    if (!isLoading) await toggleSave();
  };

  return (
    <button
      onClick={handleSaveClick}
      disabled={isLoading}
      title={isSaved ? "Unsave item" : "Save item"}
      className={`
        flex items-center justify-center w-10 h-10 rounded-xl
        transition-all duration-300 transform 
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        shadow-sm
        ${
          isSaved
            ? "bg-orange-50 text-red-600 hover:bg-orange-100 focus:ring-orange-400"
            : "bg-blue-50 text-orange-600 hover:bg-orange-100 focus:ring-orange-300"
        }
        ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {isLoading ? (
        <div
          className={`animate-spin w-4 h-4 border-2 rounded-full ${
            isSaved
              ? "border-red-600 border-t-transparent"
              : "border-orange-500 border-t-transparent"
          }`}
        />
      ) : lastSaveError ? (
        <FaRegHeart className="w-5 h-5 text-gray-400" color="orange" />
      ) : isSaved ? (
        <FaHeart className="w-5 h-5" color="#ea580c" />
      ) : (
        <FaRegHeart className="w-5 h-5" />
      )}
    </button>
  );
};

export default SaveIcon;

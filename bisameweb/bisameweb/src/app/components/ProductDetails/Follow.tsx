import React, { useState, useEffect } from "react";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { useFollows } from "../FollowersFollowing/useFollows";
import { toast } from "react-hot-toast";

interface FollowProps {
  userId: string;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  className?: string;
}

const Follow: React.FC<FollowProps> = ({
  userId,
  isFollowing,
  onFollowToggle,
  className = "",
}) => {
  console.log(isFollowing);
  
  const { follow, response, loading } = useFollows();
  console.log(response);
  console.log(response);
  
  const [localFollowing, setLocalFollowing] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  // Sync localFollowing with isFollowing prop when it changes
  useEffect(() => {
    setLocalFollowing(isFollowing);
  }, [isFollowing]);

  const handleFollowClick = async () => {
    if (loading || isLoading) return;
    setIsLoading(true);

    try {
      const result = await follow(userId);

      if (result?.success) {
        setLocalFollowing(true);
        toast.success(result.message || "Followed successfully");
        onFollowToggle?.();
      } else {
        toast.error(result?.message || "Failed to follow user");
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const following = localFollowing || isFollowing;

  return (
    <button
      onClick={handleFollowClick}
      disabled={isLoading || loading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
        transition-all duration-300 transform 
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        shadow-sm text-sm
        ${
          following
            ? "bg-orange-50 text-orange-700 border border-orange-500 focus:ring-orange-400 hover:bg-orange-100"
            : "bg-white text-blue-700 border border-blue-600 focus:ring-blue-400 hover:bg-blue-50"
        }
        ${isLoading || loading ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {isLoading || loading ? (
        <div
          className={`w-4 h-4 border-2 rounded-full animate-spin ${
            following
              ? "border-orange-600 border-t-transparent"
              : "border-blue-600 border-t-transparent"
          }`}
        />
      ) : following ? (
        <FaUserCheck className="w-4 h-4" />
      ) : (
        <FaUserPlus className="w-4 h-4" />
      )}

      <span>
        {isLoading || loading
          ? "Loading..."
          : following
          ? "Following"
          : "Follow"}
      </span>
    </button>
  );
};

export default Follow;
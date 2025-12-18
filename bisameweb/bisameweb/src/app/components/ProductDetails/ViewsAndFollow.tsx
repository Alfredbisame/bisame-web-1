"use client";

import React from "react";
import Views from "./Views";
import Follow from "./Follow";
import SaveIcon from "./SaveIcon";
import { useFollowersData } from "../FollowersFollowing/useFollowersData";
import RecordRecentView from "../BrowsingHistory/RecordRecentView";
import { useUser } from "@/app/hooks/useUser";

interface ViewsAndFollowProps {
  views: number;
  userId: string;
  className?: string;
  listingId: string | null;
}

const ViewsAndFollow: React.FC<ViewsAndFollowProps> = ({
  views,
  userId,
  className = "",
  listingId,
}) => {
  const { data } = useFollowersData();
  const { userId: currentUserId } = useUser();

  console.log(data);

  const isFollowing = React.useMemo(() => {
    console.log("Checking...");
    if (!data || !data.success) return false;
    return data.data.data.results.some((user) => user.userid === userId);
  }, [data, userId]);

  return (
    <div className={`flex items-center gap-8 py-2 mb-3 ${className}`}>
      {/* Record view */}
      {listingId && currentUserId && (
        <RecordRecentView userId={currentUserId} listingId={listingId} />
      )}

      {/* Views counter */}
      <Views views={views} />

      {/* Save icon */}
      <div className="flex items-center">
        <SaveIcon listingId={listingId} />
      </div>

      {/* Follow */}
      <div>
        <Follow userId={userId} isFollowing={isFollowing} />
      </div>
    </div>
  );
};

export default ViewsAndFollow;

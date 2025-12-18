import { useState } from "react";

// interface FollowsRequestBody {
//   toUserId: string;
// }

interface FollowsResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

export function useFollows() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<FollowsResponse | null>(null);

  const follow = async (userid: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch("/api/Dashboard/Followers/Follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUserId: userid,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to follow user");
      }
      setResponse(data);
      return data;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : JSON.stringify(err);
      setError(message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { follow, loading, error, response };
}

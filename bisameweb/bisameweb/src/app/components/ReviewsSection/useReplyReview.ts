import type { Review } from "./types";
import { useState } from "react";

interface UseReplyReviewResult {
  replyToReview: (reviewid: Review["reviewid"], reply: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  hasReplied: (reviewid: Review["reviewid"]) => boolean;
}

export function useReplyReview(): UseReplyReviewResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [repliedIds, setRepliedIds] = useState<Set<string>>(new Set());

  const replyToReview = async (reviewid: Review["reviewid"], reply: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(
        `/api/Dashboard/Reviews/Reply?id=${encodeURIComponent(reviewid)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: reply }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to send reply");
      }
      setSuccess(true);
      setRepliedIds((prev) => new Set(prev).add(reviewid));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const hasReplied = (reviewid: Review["reviewid"]) => repliedIds.has(reviewid);

  return { replyToReview, loading, error, success, hasReplied };
}

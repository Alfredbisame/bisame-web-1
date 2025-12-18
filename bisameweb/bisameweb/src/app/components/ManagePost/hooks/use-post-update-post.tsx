import { useState } from "react";

type ResultProps = { success: boolean; message?: string; error?: unknown };

const usePostUpdatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [result, setResult] = useState<ResultProps | null>(null);

  const updatePost = async (
    id: string,
    body: { [k: string]: unknown } | FormData
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // If it's FormData use as-is otherwise convert to JSON
      const isFormData = body instanceof FormData;
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: isFormData
          ? undefined
          : { "Content-Type": "application/json" },
        body: isFormData ? body : JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || "Failed to update product");
        setResult({ success: false, ...json });
        setLoading(false);
        return { success: false, ...json };
      }
      setResult({ success: true, ...json });
      setLoading(false);
      return { success: true, ...json };
    } catch (err: unknown) {
      setError(err);
      setResult({ success: false, error: err });
      setLoading(false);
      return { success: false, error: err };
    }
  };

  return { loading, error, result, updatePost };
};

export default usePostUpdatePost;

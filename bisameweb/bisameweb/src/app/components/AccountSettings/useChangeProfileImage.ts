import useSWRMutation from 'swr/mutation';
import { useCallback } from 'react';

interface ChangeProfileImageResponse {
  message: string;
  image: string;
}

// Helper to convert a File to base64 string efficiently
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Convert ArrayBuffer to base64 manually for better performance
      const buffer = reader.result as ArrayBuffer;
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = window.btoa(binary);
      resolve(base64);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
  // For even larger files, consider offloading to a Web Worker.
};

// SWR mutation fetcher
async function changeProfileImageFetcher(
  url: string,
  { arg }: { arg: File }
): Promise<ChangeProfileImageResponse> {
  const base64 = await fileToBase64(arg);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64 }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to change profile image');
  }
  return data;
}

export function useChangeProfileImage() {
  const {
    trigger,
    data,
    error,
    isMutating: loading,
    reset,
  } = useSWRMutation(
    '/api/Dashboard/Settings/ProfileImageChange',
    changeProfileImageFetcher
  );

  // Wrap trigger to always expect a File
  const changeProfileImage = useCallback(
    async (file: File) => {
      return trigger(file);
    },
    [trigger]
  );

  return {
    changeProfileImage,
    loading,
    error: error ? (error as Error).message : null,
    response: data ?? null,
    reset,
  };
} 
import useSWR from "swr";

// Define the profile data interface
export interface ProfileData {
  id: string;
  email: string | null;
  phoneNumber: string;
  countryCode: string;
  countryName: string;
  countryShortName: string;
  profilePicture: string | null;
  referralCode: string;
  userReferralCode: string;
  referralType: string;
  status: string;
  role: string;
  lastName: string;
  firstName: string;
  otherNames: string;
  authenticated: boolean;
  dateOfBirth: string | null;
}

interface ProfileResponse {
  code: number;
  data: ProfileData;
  message: string;
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<ProfileData> => {
  // Get the auth token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to fetch profile data.");
  }

  const response: ProfileResponse = await res.json();

  if (response.code !== 200) {
    throw new Error(response.message || "Failed to fetch profile data.");
  }

  return response.data;
};

const getFullName = (data: ProfileData): string => {
  const firstName = data?.firstName;
  const lastName = data?.lastName;
  const fullName = `${firstName} ${lastName}`;
  return fullName;
};

export function useProfileData() {
  const { data, error, isLoading, mutate } = useSWR<ProfileData, Error>(
    "/api/auth/profile",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onErrorRetry: (_err, _key, _config, revalidate, { retryCount }) => {
        if (retryCount < 3) {
          setTimeout(() => revalidate({ retryCount }), 1000);
        }
      },
    }
  );

  const fullName = getFullName(data as ProfileData);

  return {
    data,
    fullName,
    loading: isLoading,
    error,
    mutate,
  };
}

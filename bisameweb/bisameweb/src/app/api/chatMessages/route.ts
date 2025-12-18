import { getAuthToken } from "@/app/utils/auth";
import axios from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    const userId1 = searchParams.get("userId1");
    const userId2 = searchParams.get("userId2");

    // Run checks for missing parameters
    if (!listingId || !userId1 || !userId2) {
      return NextResponse.json(
        { error: "Missing search parameter" },
        { status: 400 }
      );
    }

    // Run checks for token
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Configure full url
    const baseUrl = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL;
    const chatUrl = process.env.NEXT_PUBLIC_CHAT_MESSAGES;

    if (!baseUrl || !chatUrl) {
      return NextResponse.json(
        { error: "Missing environment variable" },
        { status: 500 }
      );
    }

    // merge to retrieve full url
    const apiUrl = `${baseUrl}${chatUrl}?listingId=${encodeURIComponent(
      listingId
    )}&userId1=${encodeURIComponent(userId1)}&userId2=${encodeURIComponent(
      userId2
    )}`;

    const { data } = await axios.get<Response>(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!data) {
      return NextResponse.json(
        { error: "Error occurred fetching chats" },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message: error.response?.data?.message || "Failed to fetch data.",
          error: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      );
    }
    let errorMessage = "Unknown error";
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as ApiError).message === "string"
    ) {
      errorMessage = (error as ApiError).message;
    }
    return NextResponse.json(
      { success: false, message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
};

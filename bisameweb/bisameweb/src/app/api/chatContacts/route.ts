import { getAuthToken } from "@/app/utils/auth";
import axios from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    // Get all search parameters
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");
    const sortColumn = searchParams.get("sortColumn");

    // Run checks for missing search parameter
    if (!page || !pageSize || !sortColumn) {
      return NextResponse.json(
        { error: "Missing search parameters" },
        { status: 400 }
      );
    }

    // Configure full apiUrl
    const baseUrl = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL;
    const chatContactsUrl = process.env.NEXT_PUBLIC_CHAT_CONTACTS;



    // Run checks for missing env variable
    if (!baseUrl || !chatContactsUrl) {
      return NextResponse.json(
        { error: "Missing environment variable" },
        { status: 500 }
      );
    }

    // Configure full url
    const apiUrl = `${baseUrl}${chatContactsUrl}?page=${encodeURIComponent(
      page
    )}&pageSize=${encodeURIComponent(pageSize)}&sortColumn=${encodeURIComponent(
      sortColumn
    )}`;

    // Checks for token
    const token = getAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch logic
    const { data } = await axios.get<Response>(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Throw error for no data found
    if (!data) {
      return NextResponse.json(
        {
          error: "Error occurred fetching chat contacts",
        },
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

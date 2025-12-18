import { NextResponse } from "next/server";
import axios from "axios";

// Updated GET function to accept listing ID parameter
export async function GET(request: Request) {
  try {
    // Extract listing ID from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = searchParams.get("page") || 1;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Get base URL from environment variables
    const baseURL = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL;
    const endpoint = process.env.NEXT_PUBLIC_LISTINGS_API_URL;

    if (!baseURL || !endpoint) {
      return NextResponse.json(
        { error: "API configuration is missing" },
        { status: 500 }
      );
    }

    const fullURL = `${baseURL}${endpoint}?page=${encodeURIComponent(
      page
    )}&userId=${encodeURIComponent(userId)}`;

    const response = await axios({
      method: "GET",
      url: fullURL,
      headers: {
        accept: "application/json",
      },
      maxBodyLength: Infinity,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching listing details:", error);

    if (error instanceof Error && axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          { error: error.response.data.message || "Error from external API" },
          { status: error.response.status }
        );
      } else if (error.request) {
        return NextResponse.json(
          { error: "No response received from server" },
          { status: 503 }
        );
      } else {
        return NextResponse.json(
          { error: "Error setting up request" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}

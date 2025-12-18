import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// interface ListingImage {
//   imageUrl: string;
//   id: string;
// }

// interface UserInfo {
//   name: string;
//   profilePicture: string;
// }

// interface ListingAttributes {
//   [key: string]: string | number | boolean | null;
// }

export async function GET(request: NextRequest) {
  try {
    // Extract search parameters from URL
    const { searchParams } = new URL(request.url);
    const categoryGroup = searchParams.get("categoryGroup");
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "16";

    // Validate required parameters
    if (!categoryGroup || !category || !subCategory) {
      return NextResponse.json(
        {
          error: "Items is required",
          message: "Missing parameter",
        },
        { status: 400 }
      );
    }

    // Get environment variables
    const listingsBaseUrl = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL;
    const listingsSearchPath = process.env.NEXT_PUBLIC_LISTINGS_SEARCH;

    // Validate environment variables
    if (!listingsBaseUrl) {
      console.error(
        "Missing NEXT_PUBLIC_LISTINGS_BASE_URL environment variable"
      );
      return NextResponse.json(
        { error: "Server configuration error: Missing listings base URL" },
        { status: 500 }
      );
    }

    if (!listingsSearchPath) {
      console.error("Missing NEXT_PUBLIC_LISTINGS_SEARCH environment variable");
      return NextResponse.json(
        { error: "Server configuration error: Missing listings search path" },
        { status: 500 }
      );
    }

    // Construct the full API URL
    const searchApiUrl = `${listingsBaseUrl}${listingsSearchPath}?page=${page}&pageSize=${pageSize}&categoryGroup=${encodeURIComponent(
      categoryGroup?.trim()
    )}&category=${encodeURIComponent(
      category?.trim()
    )}&subCategory=${encodeURIComponent(subCategory?.trim())}`;

    console.log(`Making search request to: ${searchApiUrl}`);

    // Make API request with timeout
    const response = await axios({
      method: "GET",
      url: searchApiUrl,
      headers: {
        accept: "*/*",
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Return the response data directly
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching search data:", error);

    // Axios error handling
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorData: { message?: string; error?: string; details?: unknown } = error.response.data || {};
        return NextResponse.json(
          {
            error:
              errorData.message ||
              errorData.error ||
              "Error from search service",
            statusCode: error.response.status,
            details:
              errorData.details ||
              "An error occurred while processing your search",
          },
          { status: error.response.status }
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        return NextResponse.json(
          {
            error: "No response from server",
            message:
              "The search service is not responding. Please try again later.",
          },
          { status: 503 }
        );
      } else {
        console.error("Request setup error:", error.message);
        return NextResponse.json(
          {
            error: "Internal server error",
            message:
              "An unexpected error occurred while processing your search",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An unexpected error occurred while processing your search",
      },
      { status: 500 }
    );
  }
}
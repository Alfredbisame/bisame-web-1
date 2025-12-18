import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "12";

    const listingsBaseUrl = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL;
    const trendingListingsUrl = process.env.NEXT_PUBLIC_TRENDING_LISTINGS_URL;

    if (!listingsBaseUrl || !trendingListingsUrl) {
      return NextResponse.json(
        { error: "Listings base URL or trending listings URL not configured" },
        { status: 500 }
      );
    }

    const fullUrl = `${listingsBaseUrl}${trendingListingsUrl}`;

    // Regular paginated request
    const response = await axios({
      method: "GET",
      url: `${fullUrl}?page=${page}&pageSize=${pageSize}`,
      headers: {
        accept: "*/*",
      },
      maxBodyLength: Infinity,
    });
    console.log(response.data.data.length);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching trending listings:", error);

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

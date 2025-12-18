import { getAuthToken } from "@/app/utils/auth";
import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const categoryGroup = searchParams.get("categoryGroup") as string;

    // Checks for missing search parameter
    if (!categoryGroup) {
      return NextResponse.json(
        { error: "Missing search parameter" },
        { status: 400 }
      );
    }

    // Configuring apiUrl
    const baseUrl = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL;
    const profileListingUrl = process.env.NEXT_PUBLIC_PROFILE_LISTINGS;

    if (!baseUrl || !profileListingUrl) {
      return NextResponse.json(
        { error: "Missing environment variable" },
        { status: 500 }
      );
    }

    //Merging to get complete apiUrl
    const apiUrl = `${baseUrl}${profileListingUrl}?categoryGroup=${encodeURIComponent(
      categoryGroup
    )}`;

    console.log(apiUrl);

    // Get token and add to header
    const token = getAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      return NextResponse.json(
        { error: "Error occurred fetching data" },
        { status: 500 }
      );
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Promotions API error:", error);

    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data &&
          (error.response.data.message ||
            JSON.stringify(error.response.data))) ||
        error.message ||
        "Upstream request failed";
      const status = error.response?.status || 502;
      return NextResponse.json({ error: message }, { status });
    }

    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get("group");

    if (!group) {
      return NextResponse.json(
        { error: "Invalid query parameter" },
        { status: 400 }
      );
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL;
    const API_PROMOTION_URL = process.env.NEXT_PUBLIC_PROMOTION_PLANS;

    //Checks for API URL
    if (!API_BASE_URL || !API_PROMOTION_URL) {
      return NextResponse.json(
        { error: "Invalid server configuration" },
        { status: 400 }
      );
    }

    const API_URL = `${API_BASE_URL}${API_PROMOTION_URL}?group=${encodeURIComponent(
      group
    )}`;
    console.log(API_BASE_URL);
    const response = await axios.get(API_URL);

    if (!response) {
      return NextResponse.json(
        { error: "Error occurred while fetching data" },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
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

import { getAuthToken } from "@/app/utils/auth";
import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    // Logic to get data from the client
    const postData = await request.json();
    if (!postData) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

  

    // Logic to configure apiUrl
    const baseUrl = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL;
    const postCheckoutUrl = process.env.NEXT_PUBLIC_PROMOTION_PURCHASE;

    if (!baseUrl || !postCheckoutUrl) {
      return NextResponse.json(
        { error: "Missing environment variable" },
        { status: 500 }
      );
    }

    // Merge to get full url
    const apiUrl = `${baseUrl}${postCheckoutUrl}`;

    // Run checks for token
    const token = getAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.post(apiUrl, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      return NextResponse.json(
        { error: "No data retrieved from response" },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data, { status: 201 });
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

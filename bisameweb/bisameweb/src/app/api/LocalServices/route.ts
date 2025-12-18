import { NextResponse } from "next/server";
import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the base URL from environment variables
    const listingsBaseUrl = process.env.NEXT_PUBLIC_LISTINGS_BASE_URL;
    const homePageSectionApiUrl =
      process.env.NEXT_PUBLIC_HOME_PAGE_SECTION_API_URL;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "5";

    // Construct the full API URL with query parameters
    const sectionTitle = "Explore Local Services";

    const apiUrl = `${listingsBaseUrl}${homePageSectionApiUrl}?page=${page}&pageSize=${pageSize}&sectionTitle=${encodeURIComponent(
      sectionTitle
    )}`;

    console.log(`Fetching local services data from: ${apiUrl}`);

    const response = await axios({
      method: "GET",
      url: apiUrl,
      headers: {
        Accept: "application/json",
      },
      timeout: 10000, 
      maxBodyLength: 10 * 1024 * 1024, 
    });
    console.log(`Local Services API responded with status: ${response.status}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching local services data:", error);

    if (error instanceof Error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            `API responded with status ${
              error.response.status
            }: ${JSON.stringify(error.response.data)}`
          );
          return NextResponse.json(
            { error: error.response.data.message || "Error from external API" },
            { status: error.response.status }
          );
        } else if (error.request) {
          console.error("No response received from server");
          return NextResponse.json(
            { error: "No response received from server" },
            { status: 503 }
          );
        } else {
          console.error(`Request setup error: ${error.message}`);
          return NextResponse.json(
            { error: "Error setting up request" },
            { status: 500 }
          );
        }
      }
    }

    // Fallback error response
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

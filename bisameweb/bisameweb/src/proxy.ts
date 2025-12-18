import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/app/utils/auth";

export function proxy(request: NextRequest) {
  const token = getAuthToken(request);
  const url = request.nextUrl.clone();

  // Protect all dashboard routes
  if (url.pathname.startsWith("/dashboard") && !token) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/UserAccounts/SignIn";

    // Save the original dashboard path
    signInUrl.searchParams.set("returnTo", url.pathname + url.search);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/promotion",
    "/dashboard/manage-post",
    "/dashboard/chat-messages",
    "/dashboard/followers",
    "/dashboard/promotion",
    "/dashboard/purchases",
    "/dashboard/reviews",
    "/dashboard/saved",
    "/dashboard/settings",
    "/dashboard/trade-assurance",
  ],
};

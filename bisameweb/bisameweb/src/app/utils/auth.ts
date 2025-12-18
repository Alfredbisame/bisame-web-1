export function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  console.log(cookieHeader);
  console.log("Cookie header:", cookieHeader);

  if (!cookieHeader) {
    console.log("No cookie header found");
    return null;
  }

  // Split cookies by semicolon and space
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    if (cookie.startsWith("auth-token=")) {
      const token = cookie.substring("auth-token=".length);
      console.log("Found auth token:", token ? "YES" : "NO");
      return token ? decodeURIComponent(token) : null;
    }
  }

  console.log("No auth-token cookie found");
  return null;
}

export const getToken = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("No token found");
  }
  return token;
};

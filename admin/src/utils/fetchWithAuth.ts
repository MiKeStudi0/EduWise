import { refreshAccessToken } from "./refreshAccessToken";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  options.headers = headers;

  let response = await fetch(url, options);

  // If 401 Unauthorized, try to refresh the token
  if (response.status === 401 && refreshToken) {
    try {
      accessToken = await refreshAccessToken();
      
      // Update the header with the new token and retry once
      headers.set("Authorization", `Bearer ${accessToken}`);
      options.headers = headers;
      response = await fetch(url, options);
    } catch (error) {
      console.error("fetchWithAuth: Token refresh failed", error);
      localStorage.clear(); // Clear all auth data
      window.location.href = "/login";
      throw new Error("AUTH_FAILED");
    }
  }

  return response;
}
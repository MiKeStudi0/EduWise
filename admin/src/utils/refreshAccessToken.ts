export async function refreshAccessToken() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    // Clear storage just in case there's a dead access_token left behind
    localStorage.clear();
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // If the refresh token is invalid/expired, log them out
      localStorage.clear();
      throw new Error("Session expired. Please login again.");
    }

    const data = await response.json();
    
    // Safety check: ensure the API actually returned a token
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    } else {
      throw new Error("Invalid response format from server");
    }
    
  } catch (error) {
    localStorage.clear();
    throw error;
  }
}
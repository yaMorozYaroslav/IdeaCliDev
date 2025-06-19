import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export async function refreshToken() {
  const accessToken = Cookies.get("access_token");
  const hasRefreshToken = document.cookie.includes("refresh_token=");

  if (!hasRefreshToken) {
    console.log("⚠️ No refresh token cookie found. Skipping refresh.");
    return;
  }

  let shouldRefresh = true;

  if (accessToken) {
    try {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decodedToken.exp - currentTime;

      console.log(`⏳ Access token expires in ${timeLeft} seconds.`);

      if (timeLeft > 700) {
        console.log("✅ Access token is still valid. Skipping refresh.");
        shouldRefresh = false;
      }
    } catch (err) {
      console.warn("⚠️ Access token is invalid or expired. Will attempt refresh.");
    }
  } else {
    console.log("⚠️ No access token found. Attempting refresh...");
  }

  if (!shouldRefresh) return;

  try {
    const response = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("❌ Refresh failed. Clearing cookies.");
      Cookies.remove("user_data"); // don't touch httpOnly access_token
      return;
    }

    const data = await response.json();

    if (data.accessToken && data.userData) {
      // 🛑 Do NOT overwrite access_token if it's httpOnly
      // ✅ Only set user_data if needed on client
      Cookies.set("user_data", JSON.stringify(data.userData), {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 min
        path: "/",
      });

      console.log("✅ User data cookie refreshed successfully.");
    } else {
      console.error("❌ No data returned. Logging out.");
      Cookies.remove("user_data");
    }

  } catch (error) {
    console.error("❌ Error during token refresh:", error);
  }
}

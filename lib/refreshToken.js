import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export async function refreshToken() {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  if (!refreshToken) {
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
    });

    const data = await response.json();

    if (!response.ok || !data?.accessToken) {
      console.error("❌ Refresh failed or no access token returned.");
      Cookies.remove("user_data");
      return;
    }

    // ✅ Do not overwrite user_data here — server already sets correct cookies
    console.log("✅ Token refresh successful. Cookies should now be updated.");
    window.dispatchEvent(new Event("tokenRefreshed")); // helpful for syncing UI

  } catch (error) {
    console.error("❌ Error during token refresh:", error);
  }
}

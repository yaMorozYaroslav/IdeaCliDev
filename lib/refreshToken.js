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
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user_data");
      return;
    }

    console.log("✅ Token refresh successful. Cookies should now be updated.");

    setTimeout(() => {
      try {
        const raw = Cookies.get("user_data");
        if (raw) {
          const isEncoded = raw.startsWith("%7B");
          const user = isEncoded
            ? JSON.parse(decodeURIComponent(raw))
            : JSON.parse(raw);

          console.log("👤 Re-parsed user_data after refresh:", user);
        } else {
          console.warn("⚠️ user_data not found in cookies after refresh");
        }
      } catch (err) {
        console.error("❌ Failed to parse user_data after refresh:", err);
      }

      window.dispatchEvent(new Event("tokenRefreshed"));
    }, 300);

  } catch (error) {
    console.error("❌ Error during token refresh:", error);
  }
}

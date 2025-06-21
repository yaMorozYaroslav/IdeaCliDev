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
      credentials: "include", // ✅ needed to send cookies
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok || !data?.accessToken) {
      console.error("❌ Refresh failed or no access token returned.");
      Cookies.remove("user_data"); // optional: cleanup
      return;
    }

    if (data.userData) {
      Cookies.set("user_data", JSON.stringify(data.userData), {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 min
        path: "/",
      });

      console.log("✅ Refreshed and updated user data cookie.");
    }

  } catch (error) {
    console.error("❌ Error during token refresh:", error);
  }
}

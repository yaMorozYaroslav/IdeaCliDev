import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export async function refreshToken() {
  const accessToken = Cookies.get("access_token");

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
    console.log("⚠️ No access token found. Attempting refresh anyway...");
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
      Cookies.remove("access_token");
      Cookies.remove("user_data");
      return;
    }

    const data = await response.json();

    if (data.accessToken) {
      Cookies.set("access_token", data.accessToken, { expires: 0.01, path: "/" });
      console.log("✅ Access token refreshed successfully.");
    } else {
      console.error("❌ No access token returned. Logging out.");
      Cookies.remove("access_token");
      Cookies.remove("user_data");
    }

  } catch (error) {
    console.error("❌ Error during token refresh:", error);
  }
}

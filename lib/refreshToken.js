import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export async function refreshToken() {
  const accessToken = Cookies.get("access_token");

  // Allow refresh even if accessToken is missing
  if (!accessToken) {
    console.log("⚠️ No access token. Trying to refresh anyway...");
  } else {
    try {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decodedToken.exp - currentTime;

      console.log(`⏳ Access token expires in ${timeLeft} seconds.`);
      if (timeLeft > 700) {
        console.log("✅ Token is still valid, skipping refresh.");
        return;
      }
    } catch (err) {
      console.warn("⚠️ Access token is invalid or expired.");
    }
  }

  // 🔄 Try to refresh regardless
  try {
    const response = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("❌ Token refresh failed. User must log in again.");
      Cookies.remove("access_token");
      Cookies.remove("user_data");
      return;
    }

    const data = await response.json();
    console.log("✅ Token refreshed:", data.accessToken);

    // Update cookies
    Cookies.set("access_token", data.accessToken, { expires: 0.01, path: "/" });

  } catch (error) {
    console.error("❌ Error during refresh:", error);
  }
}

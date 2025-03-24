import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export async function refreshToken() {
  const accessToken = Cookies.get("access_token");

  if (!accessToken) {
    console.log("⚠️ No access token found, skipping refresh.");
    return;
  }

  try {
    const decodedToken = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeLeft = decodedToken.exp - currentTime;

    console.log(`⏳ Access token expires in ${timeLeft} seconds.`);

    if (timeLeft > 700) { // ✅ Skip refresh if more than 10 minutes left
      console.log("✅ Token is still valid, skipping refresh.");
      return;
    }

    console.log("🔄 Token is close to expiration, refreshing...");

    const response = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      console.error("❌ Token refresh failed. User must log in again.");
      Cookies.remove("access_token");
      Cookies.remove("user_data");
      return;
    }

    const data = await response.json();
    console.log("✅ Token refreshed:", data.accessToken);

    // ✅ Update cookies with new access token
    Cookies.set("access_token", data.accessToken, { expires: 0.01, path: "/" });

  } catch (error) {
    console.error("❌ Error refreshing token:", error);
  }
}

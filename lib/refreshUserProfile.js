import getBaseUrl from "./getBaseUrl";

export async function refreshUserProfile(userId, accessToken) {
  try {
    const baseUrl = getBaseUrl(); // → Heroku backend URL
    const res = await fetch(`${baseUrl}/google/public/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken }),
    });

    if (!res.ok) {
      console.warn("⚠️ Failed to fetch user from backend:", res.status);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ refreshUserProfile error:", err.message);
    return null;
  }
}

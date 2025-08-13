// lib/refreshUserProfile.js
import getBaseUrl from "./getBaseUrl";

export async function refreshUserProfile(userId, accessToken) {
  try {
    const baseUrl = getBaseUrl(); // Heroku/backend base
    const res = await fetch(`${baseUrl}/google/public/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken }),
      cache: "no-store",
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore non-JSON
    }

    if (!res.ok) {
      console.warn("⚠️ Failed to fetch user from backend:", res.status, data?.message);
      return null;
    }

    return data; // profile (includes private fields if requester is owner)
  } catch (err) {
    console.error("❌ refreshUserProfile error:", err?.message || err);
    return null;
  }
}

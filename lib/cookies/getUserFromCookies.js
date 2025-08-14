import Cookies from "js-cookie";

export function getUserFromCookies() {
  try {
    const raw = Cookies.get("user_data");
    if (!raw) {
      console.warn("❌ No user_data found in cookies");
      return null;
    }

    // ✅ Fix: Decode before parsing
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded);

    return {
      userId: parsed.userId,
      email: parsed.email,
      name: parsed.name,
      picture: parsed.picture,
      status: parsed.status,
      unansweredCount: parsed.unansweredCount ?? 0,
    };
  } catch (err) {
    console.error("❌ Failed to parse user_data cookie:", err);
    return null;
  }
}

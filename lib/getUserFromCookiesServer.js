// app/lib/getUserFromCookiesServer.js
import { cookies } from "next/headers";

export async function getUserFromCookiesServer() {
  try {
    const store = await cookies(); // must await in the App Router
    const raw = store.get("user_data")?.value;
    if (!raw) return null;

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      try {
        parsed = JSON.parse(decodeURIComponent(raw));
      } catch {
        return null;
      }
    }

    return {
      userId: parsed.userId ?? parsed.googleId ?? null,
      email: parsed.email ?? null,
      name: parsed.name ?? null,
      picture: parsed.picture ?? null,
      status: parsed.status ?? null,
      unansweredCount:
        typeof parsed.unansweredCount === "number" ? parsed.unansweredCount : 0,
    };
  } catch (err) {
    console.error("getUserFromCookiesServer failed:", err);
    return null;
  }
}

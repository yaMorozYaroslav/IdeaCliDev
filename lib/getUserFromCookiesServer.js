// app/lib/getUserFromCookiesServer.ts
import { cookies } from "next/headers";

export function getUserFromCookiesServer() {
  try {
    const store = cookies(); // sync
    const raw = store.get("user_data")?.value;
    if (!raw) return null;

    let user;
    try {
      user = JSON.parse(raw);
    } catch {
      user = JSON.parse(decodeURIComponent(raw));
    }

    return {
      userId: user.userId || user.googleId || null,
      email: user.email || null,
      name: user.name || null,
      picture: user.picture || null,
      status: user.status || null,
      unansweredCount: user.unansweredCount ?? 0,
    };
  } catch (err) {
    console.error("getUserFromCookiesServer failed:", err);
    return null;
  }
}

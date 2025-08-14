// lib/getUserFromCookiesServer.js (JS)
import { cookies } from "next/headers";

const safeParse = (v) => {
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(v));
    } catch {
      return null;
    }
  }
};

const isValidUser = (u) => !!u && typeof u === "object" && (u.googleId || u.userId);

export async function getUserFromCookiesServer() {
  const store = await cookies(); // ok to await; returns the cookie store
  const raw = store.get("user_data")?.value;
  const parsed = safeParse(raw);

  if (!isValidUser(parsed)) {
    return null; // critical: never return {} for anonymous users
  }

  const { googleId, userId, name, picture, status, unansweredCount } = parsed;
  return { googleId, userId, name, picture, status, unansweredCount };
}

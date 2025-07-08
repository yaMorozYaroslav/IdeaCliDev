import { cookies } from "next/headers";

export async function getUserFromCookiesServer() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get("user_data")?.value;
    if (!raw) return null;

    const user = JSON.parse(raw);
    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      status: user.status,
      unansweredCount: user.unansweredCount ?? 0,
    };
  } catch (err) {
    console.error("❌ Failed to parse user_data cookie:", err.message);
    return null;
  }
}

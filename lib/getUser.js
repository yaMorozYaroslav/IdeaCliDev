import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function getUser() {
  const cookieStore = cookies(); // ✅ Next.js server-side cookie API
  const accessToken = cookieStore.get("access_token")?.value;
  const userCookie = cookieStore.get("user_data")?.value;

  if (!accessToken) return null;

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "test";
    const decoded = jwt.verify(accessToken, JWT_SECRET);

    let parsedUser = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      status: decoded.status,
    };

    if (userCookie) {
      try {
        const fullUser = JSON.parse(userCookie); // cookies() gives decoded value
        parsedUser = { ...parsedUser, ...fullUser };
      } catch (err) {
        console.warn("⚠️ Failed to parse user_data cookie:", err.message);
      }
    }

    return parsedUser;
  } catch (err) {
    console.error("❌ Invalid access token:", err.message);
    return null;
  }
}

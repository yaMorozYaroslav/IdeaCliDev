import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies();
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
        const decodedValue = decodeURIComponent(userCookie);
        const fullUser = JSON.parse(decodedValue);
        parsedUser = { ...parsedUser, ...fullUser };
      } catch (err) {
        console.warn("⚠️ Failed to parse user_data cookie:", err.message);
      }
    }

    return parsedUser;
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return null;
  }
}

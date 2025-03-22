// utils/getUserFromCookies.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return null;

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "test";
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    console.log(decoded)
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      status: decoded.status,
    };
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return null;
  }
}

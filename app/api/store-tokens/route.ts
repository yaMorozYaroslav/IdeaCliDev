import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { access_token, refresh_token, user_data } = await request.json();

  if (!access_token || !refresh_token || !user_data) {
    return NextResponse.json({ message: "Missing token data" }, { status: 400 });
  }

  const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";
  const response = NextResponse.json({ message: "Tokens stored" });

  // ✅ Must use SameSite: "none" and Secure: true in production (Vercel)
  const sameSite = isLocal ? "lax" : "none";
  const secure = !isLocal;

  response.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  response.cookies.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  response.cookies.set("user_data", JSON.stringify(user_data), {
    httpOnly: false,
    secure,
    sameSite,
    path: "/",
    maxAge: 15 * 60,
  });

  console.log("✅ Tokens stored via /api/store-tokens");
  return response;
}

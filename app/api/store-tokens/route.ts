import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { access_token, refresh_token, user_data } = await request.json();

  if (!access_token || !refresh_token || !user_data) {
    return NextResponse.json({ message: "Missing token data" }, { status: 400 });
  }

  const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";
  const response = NextResponse.json({ message: "Tokens stored" });

  response.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "strict",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  response.cookies.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  response.cookies.set("user_data", JSON.stringify(user_data), {
    httpOnly: false,
    secure: !isLocal,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  console.log("✅ Tokens stored via /api/store-tokens");
  return response;
}

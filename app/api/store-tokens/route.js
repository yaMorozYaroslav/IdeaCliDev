import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  const response = NextResponse.redirect(new URL("/", request.url));

  // ❌ No tokens = delete everything
  if (!accessToken || !refreshToken) {
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");
    return response;
  }

  // ✅ Set HttpOnly tokens
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  // ✅ Decode access token to get user data
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "test";
    const decoded = jwt.verify(accessToken, JWT_SECRET);

    const userData = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      status: decoded.status,
      userId: decoded.userId
    };

    // ✅ Set user_data cookie (non-HttpOnly, frontend-accessible)
    response.cookies.set("user_data", JSON.stringify(userData), {
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 15 * 60, // match access_token (15 minutes)
    });
  } catch (err) {
    console.error("❌ Invalid access token, cleaning up cookies:", err.message);
    response.cookies.delete("user_data");
  }

  return response;
}

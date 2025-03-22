import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear HttpOnly secure cookies
  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 0,
  });

  // Clear frontend-accessible cookie
  response.cookies.set("user_data", "", {
    httpOnly: false,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

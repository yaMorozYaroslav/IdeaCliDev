import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("📩 POST /api/store-tokens received:", body);

  const { accessToken, refreshToken, userData } = body;

  if (!accessToken || !refreshToken || !userData) {
    return NextResponse.json({ message: "Missing token data" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Cookies set" });

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60,
    path: "/",
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  response.cookies.set("user_data", JSON.stringify(userData), {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60,
    path: "/",
  });

  return response;
}

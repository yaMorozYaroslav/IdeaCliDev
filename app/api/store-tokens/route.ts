import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { access_token, refresh_token, user_data } = await request.json();

  if (!access_token || !refresh_token || !user_data) {
    return NextResponse.json({ message: "Missing token data" }, { status: 400 });
  }

  // ✅ Detect if running locally
  const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";

  const response = NextResponse.json({ message: "Tokens stored" });

  const cookieOptions = {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
  };

  response.cookies.set("access_token", access_token, {
    ...cookieOptions,
    maxAge: 15 * 60, // 15 minutes
  });

  response.cookies.set("refresh_token", refresh_token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  response.cookies.set("user_data", JSON.stringify(user_data), {
    httpOnly: false,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 15 * 60,
  });

  console.log("✅ Cookies set:", {
    access_token: access_token.slice(0, 10) + "...",
    refresh_token: refresh_token.slice(0, 10) + "...",
    user_data: user_data.name,
    isLocal,
  });

  return response;
}

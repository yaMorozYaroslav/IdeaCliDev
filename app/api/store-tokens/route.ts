import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { access_token, refresh_token, user_data } = await request.json();

  if (!access_token || !refresh_token || !user_data) {
    return NextResponse.json({ message: "Missing token data" }, { status: 400 });
  }

  const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";

  const response = new NextResponse(JSON.stringify({ message: "Tokens stored" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
  };

  // ✅ Make sure all cookie values are strings
  response.cookies.set("access_token", String(access_token), {
    ...cookieOptions,
    maxAge: 15 * 60,
  });

  response.cookies.set("refresh_token", String(refresh_token), {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });

  response.cookies.set("user_data", JSON.stringify(user_data), {
    httpOnly: false,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 15 * 60,
  });

  console.log("✅ Cookies set:", {
    access_token: String(access_token).slice(0, 10) + "...",
    refresh_token: String(refresh_token).slice(0, 10) + "...",
    user_data: user_data.name,
    isLocal,
  });

  return response;
}

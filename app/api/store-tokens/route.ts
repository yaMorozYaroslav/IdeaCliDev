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

  // ✅ Set access token
  response.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 15 * 60,
  });

  // ✅ Set refresh token
  response.cookies.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  // ✅ Decode and parse user_data
  let parsedUser;
  try {
    parsedUser = JSON.parse(decodeURIComponent(user_data));
  } catch (err) {
    console.error("❌ Failed to decode user_data:", err);
    return NextResponse.json({ message: "Invalid user_data format" }, { status: 400 });
  }

  const { userId, email, name, picture, status, unanswered } = parsedUser;

  // ✅ Set user_data cookie
  response.cookies.set("user_data", encodeURIComponent(JSON.stringify({ userId, email, name, picture, status })), {
    httpOnly: false,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 15 * 60,
  });

  // ✅ Set unanswered cookie
  if (Array.isArray(unanswered)) {
    response.cookies.set("unanswered", encodeURIComponent(JSON.stringify(unanswered)), {
      httpOnly: false,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "none",
      path: "/",
      maxAge: 15 * 60,
    });
  } else {
    response.cookies.set("unanswered", "", {
      httpOnly: false,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "none",
      path: "/",
      maxAge: 0,
    });
  }

  console.log("✅ Cookies set successfully");
  return response; // ✅ This is what sends the cookies
}

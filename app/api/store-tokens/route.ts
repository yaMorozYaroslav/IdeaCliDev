import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { access_token, refresh_token, user_data } = await request.json();

  if (!access_token || !refresh_token || !user_data) {
    return new Response(JSON.stringify({ message: "Missing token data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";

  const response = new NextResponse(JSON.stringify({ message: "Tokens stored" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  // ✅ Set access token
  response.cookies.set({
    name: "access_token",
    value: access_token,
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  // ✅ Set refresh token
  response.cookies.set({
    name: "refresh_token",
    value: refresh_token,
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  // ✅ Safely parse and decode user_data
  let parsedUser;
  try {
    parsedUser = JSON.parse(decodeURIComponent(user_data));
  } catch (err) {
    console.error("❌ Failed to decode user_data:", err);
    return new Response(JSON.stringify({ message: "Invalid user_data format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { userId, email, name, picture, status, unanswered } = parsedUser;

  // ✅ Set user_data as cookie
  response.cookies.set({
    name: "user_data",
    value: encodeURIComponent(JSON.stringify({ userId, email, name, picture, status })),
    httpOnly: false,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 15 * 60,
  });

  // ✅ Set unanswered separately if valid
  if (Array.isArray(unanswered)) {
    response.cookies.set({
      name: "unanswered",
      value: encodeURIComponent(JSON.stringify(unanswered)),
      httpOnly: false,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "none",
      path: "/",
      maxAge: 15 * 60,
    });
  } else {
    // Clear cookie if not valid
    response.cookies.set("unanswered", "", {
      httpOnly: false,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "none",
      path: "/",
      maxAge: 0,
    });
  }

  console.log("✅ Cookies set successfully");
  return response;
}

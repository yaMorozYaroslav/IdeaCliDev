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

  // ✅ Store access_token
  response.cookies.set({
    name: "access_token",
    value: access_token,
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 15 * 60,
  });

  // ✅ Store refresh_token
  response.cookies.set({
    name: "refresh_token",
    value: refresh_token,
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  // ✅ Split user_data and unanswered
  const { userId, email, name, picture, status, unanswered } = user_data;

  response.cookies.set({
    name: "user_data",
    value: JSON.stringify({ userId, email, name, picture, status }),
    httpOnly: false,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
    maxAge: 15 * 60,
  });

  if (unanswered?.length) {
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
    response.cookies.delete("unanswered");
  }

  console.log("✅ Cookies set successfully");

  return response;
}

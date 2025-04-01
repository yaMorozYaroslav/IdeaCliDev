// /app/api/refresh-token/route.js

import { NextResponse } from "next/server";

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie");

  try {
    const res = await fetch("https://idea-sphere-50bb3c5bc07b.herokuapp.com/api/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader || "", // forward cookies to Express
      },
      body: JSON.stringify({
        accessToken: null, // or pass current one if you have it
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    const nextRes = NextResponse.json({ accessToken: data.accessToken });

    nextRes.cookies.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 15 * 60,
    });

    return nextRes;
  } catch (error) {
    console.error("❌ Error hitting Express refresh route:", error.message);
    const failRes = NextResponse.json({ message: "Token refresh failed" }, { status: 500 });
    failRes.cookies.delete("access_token");
    failRes.cookies.delete("refresh_token");
    failRes.cookies.delete("user_data");
    return failRes;
  }
}

import { NextResponse } from "next/server";

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie");

  // 🔍 Extract refresh token only
  const cookieMap = new Map(
    (cookieHeader || "")
      .split(";")
      .map((c) => c.trim().split("="))
  );

  const refreshToken = cookieMap.get("refresh_token") || null;

  if (!refreshToken) {
    console.error("❌ No refresh token found in cookies.");
    const failRes = NextResponse.json({ message: "No refresh token" }, { status: 401 });
    failRes.cookies.delete("access_token");
    failRes.cookies.delete("refresh_token");
    failRes.cookies.delete("user_data");
    return failRes;
  }

  try {
    const res = await fetch("https://idea-sphere-50bb3c5bc07b.herokuapp.com/google/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }), // ✅ only send refresh token
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
    console.error("❌ Error during refresh:", error.message);
    const failRes = NextResponse.json({ message: "Refresh failed" }, { status: 500 });
    failRes.cookies.delete("access_token");
    failRes.cookies.delete("refresh_token");
    failRes.cookies.delete("user_data");
    return failRes;
  }
}

import { NextResponse } from "next/server";

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie");

  // 🔍 Extract tokens from cookies manually
  const cookieMap = new Map(
    (cookieHeader || "")
      .split(";")
      .map((c) => c.trim().split("="))
  );

  const accessToken = cookieMap.get("access_token") || null;
  const refreshToken = cookieMap.get("refresh_token") || null;

  try {
    const res = await fetch("https://idea-sphere-50bb3c5bc07b.herokuapp.com/google/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, refreshToken }), // ✅ clearly send both
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

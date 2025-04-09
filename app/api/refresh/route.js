import { NextResponse } from "next/server";
import getBaseUrl from "/lib/getBaseUrl"; // ✅ fixed path to be relative

export async function POST(request) {
  const cookieHeader = request.headers.get("cookie") || "";

  // Parse cookies into a Map
  const cookieMap = new Map(
    cookieHeader.split(";").map((c) => c.trim().split("="))
  );

  const refreshToken = cookieMap.get("refresh_token");

  // ✅ If no token, skip backend request & return clean response
  if (!refreshToken) {
    console.warn("⚠️ No refresh token found in cookies. Skipping refresh.");
    return NextResponse.json({ message: "No refresh token present" }, { status: 200 });
  }

  try {
    const url = getBaseUrl(request); // 🔁 pass request to get proper env
    const res = await fetch(`${url}/google/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    // ✅ Set new access token
    const nextRes = NextResponse.json({ accessToken: data.accessToken });

    nextRes.cookies.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return nextRes;
  } catch (error) {
    console.error("❌ Error during refresh:", error.message);

    const failRes = NextResponse.json({ message: "Refresh failed" }, { status: 500 });

    // Clear all auth cookies
    failRes.cookies.delete("access_token");
    failRes.cookies.delete("refresh_token");
    failRes.cookies.delete("user_data");
    failRes.cookies.delete("has_refresh");

    return failRes;
  }
}

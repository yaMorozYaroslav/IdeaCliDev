import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // ✅ Correct import for accessing cookies
import getBaseUrl from "/lib/getBaseUrl"; // ✅ Your helper

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value; // ✅ Get from cookie storage

    if (!refreshToken) {
      console.warn("⚠️ No refresh token found in cookies. Skipping refresh.");
      return NextResponse.json({ message: "No refresh token present" }, { status: 200 });
    }

    const baseUrl = getBaseUrl(request);

    // 🔥 Send refreshToken to your backend
    const backendRes = await fetch(`${baseUrl}/google/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const backendData = await backendRes.json();

    if (!backendRes.ok) {
      throw new Error(backendData.message || "Failed to refresh token");
    }

    // ✅ Issue new access_token cookie
    const response = NextResponse.json({ accessToken: backendData.accessToken });

    response.cookies.set("access_token", backendData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return response;

  } catch (error) {
    console.error("❌ Error during token refresh:", error.message);

    const response = NextResponse.json({ message: "Refresh failed" }, { status: 401 });

    // ❌ Clean up cookies if refresh failed
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");
    response.cookies.delete("has_refresh");

    return response;
  }
}

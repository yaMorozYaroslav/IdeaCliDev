import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import getBaseUrl from "/lib/getBaseUrl";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      console.warn("⚠️ No refresh token found in cookies.");
      return NextResponse.json({ message: "No refresh token present" }, { status: 200 });
    }

    const baseUrl = getBaseUrl(request);

    const backendRes = await fetch(`${baseUrl}/google/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const backendData = await backendRes.json();

    if (!backendRes.ok) {
      throw new Error(backendData.message || "Failed to refresh token");
    }

    const response = NextResponse.json({ accessToken: backendData.accessToken });

    // ✅ Refresh access token
    response.cookies.set("access_token", backendData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 15 * 60,
    });

    // ✅ Refresh user_data cookie
    const JWT_SECRET = process.env.JWT_SECRET || "test";
    const decoded = jwt.verify(backendData.accessToken, JWT_SECRET);

    const userData = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      status: decoded.status,
      userId: decoded.userId,
    };

    response.cookies.set("user_data", JSON.stringify(userData), {
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 15 * 60,
    });

    // ✅ Client-side can now fire "tokenRefreshed" event
    response.headers.set("X-Refresh-Complete", "true");

    return response;

  } catch (error) {
    console.error("❌ Error during token refresh:", error.message);

    const response = NextResponse.json({ message: "Refresh failed" }, { status: 401 });
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");

    return response;
  }
}

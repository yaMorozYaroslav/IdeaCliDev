import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import getBaseUrl from "../../../lib/getBaseUrl"; // adjust path if needed
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const baseUrl = getBaseUrl(request);

    const backendRes = await fetch(`${baseUrl}/google/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!backendRes.ok) throw new Error("Backend refresh failed");

    const { accessToken, userData } = await backendRes.json();

    const response = NextResponse.json({ accessToken });

    // ✅ Set access_token cookie with forced correct type
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict" as "strict", // ✅ type-cast to fix TS error
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    // ✅ Set user_data cookie
    response.cookies.set("user_data", encodeURIComponent(JSON.stringify(userData)), {
      httpOnly: false,
      secure: true,
      sameSite: "lax" as "lax", // ✅ type-cast to fix TS error
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return response;
  } catch (err) {
    console.error("❌ Refresh error:", err);

    const response = NextResponse.json({ message: "Refresh failed" }, { status: 401 });
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");

    return response;
  }
}

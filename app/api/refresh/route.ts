import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// If you're not using aliasing like @ or /lib, fix this import:
import getBaseUrl from "../../../lib/getBaseUrl"; // or use relative path if needed

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      console.warn("⚠️ No refresh token found in cookies");
      return NextResponse.json({ message: "No refresh token" }, { status: 401 });
    }

    const baseUrl = getBaseUrl(request);

    const backendRes = await fetch(`${baseUrl}/google/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!backendRes.ok) {
      console.error("❌ Backend refresh endpoint failed with status", backendRes.status);
      throw new Error("Failed to refresh token from backend");
    }

    const { accessToken, userData } = await backendRes.json();

    if (!accessToken || !userData) {
      throw new Error("Missing accessToken or userData in backend response");
    }

    const response = NextResponse.json({ accessToken });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set("user_data", encodeURIComponent(JSON.stringify(userData)), {
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return response;
  } catch (err) {
    console.error("❌ Refresh token error:", err);

    const response = NextResponse.json(
      { message: "Refresh failed", error: err instanceof Error ? err.message : String(err) },
      { status: 401 }
    );

    // Clean up cookies on failure
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");

    return response;
  }
}

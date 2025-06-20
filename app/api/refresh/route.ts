import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getBaseUrl from "../../../lib/getBaseUrl";

export async function POST() {
  const cookieStore = await cookies(); // ✅ await is required
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    console.log("🔕 No refresh token found in cookies");
    return NextResponse.json({ message: "No refresh token present" }, { status: 200 });
  }

  try {
    const baseUrl = getBaseUrl();
    console.log("🌐 Refreshing token from backend:", `${baseUrl}/google/refresh`);

    const backendRes = await fetch(`${baseUrl}/google/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const raw = await backendRes.text();
    console.log("🧪 Raw response from backend:", raw);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("❌ Failed to parse backend JSON:", e);
      throw new Error("Invalid backend JSON");
    }

    const { accessToken, userData } = parsed;

    if (!accessToken) {
      throw new Error("Access token missing");
    }

    const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";
    const response = NextResponse.json({ accessToken, userData: userData || null });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    if (userData) {
      response.cookies.set("user_data", JSON.stringify(userData), {
        httpOnly: false,
        secure: !isLocal,
        sameSite: "lax",
        maxAge: 15 * 60,
        path: "/",
      });
    }

    console.log("✅ Cookies set successfully");
    return response;
  } catch (err) {
    console.error("❌ Refresh error:", err.message);
    const response = NextResponse.json({ message: "Refresh failed" }, { status: 200 });

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");

    return response;
  }
}

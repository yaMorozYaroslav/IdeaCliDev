import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getBaseUrl from "../../../lib/getBaseUrl";

export async function POST() {
  const cookieStore = cookies(); // ✅ FIXED: sync call
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
    const response = new NextResponse(JSON.stringify({ accessToken, userData: userData || null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    response.cookies.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "none",
      path: "/",
      maxAge: 15 * 60,
    });

    if (userData) {
      response.cookies.set({
        name: "user_data",
        value: JSON.stringify(userData),
        httpOnly: false,
        secure: !isLocal,
        sameSite: isLocal ? "lax" : "none",
        path: "/",
        maxAge: 15 * 60,
      });
    }

    console.log("✅ Cookies refreshed successfully");
    return response;
  } catch (err: any) {
    console.error("❌ Refresh error:", err.message);

    const response = NextResponse.json({ message: "Refresh failed" }, { status: 200 });
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");

    return response;
  }
}

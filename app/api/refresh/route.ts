import { NextResponse } from "next/server";
import getBaseUrl from "../../../lib/getBaseUrl";

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      console.log("🔕 No refresh token provided in request body");
      return NextResponse.json({ message: "No refresh token present" }, { status: 200 });
    }

    const baseUrl = getBaseUrl();
    console.log("🌐 Refreshing token from backend:", `${baseUrl}/google/refresh`);

    const backendRes = await fetch(`${baseUrl}/google/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const raw = await backendRes.text();
    console.log("🧪 Raw backend response:", raw);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Failed to parse backend JSON:", err.message);
      throw new Error("Invalid backend response");
    }

    const { accessToken, userData } = parsed;
    if (!accessToken) throw new Error("Access token missing");

    const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";
    const response = NextResponse.json({ accessToken, userData });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "none",
      path: "/",
      maxAge: 15 * 60,
    });

    if (userData) {
      response.cookies.set("user_data", JSON.stringify(userData), {
        httpOnly: false,
        secure: !isLocal,
        sameSite: isLocal ? "lax" : "none",
        path: "/",
        maxAge: 15 * 60,
      });
    }

    console.log("✅ Refresh succeeded");
    return response;
  } catch (err) {
    console.error("❌ Refresh failed:", err.message);
    const response = NextResponse.json({ message: "Refresh failed" }, { status: 200 });

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");

    return response;
  }
}

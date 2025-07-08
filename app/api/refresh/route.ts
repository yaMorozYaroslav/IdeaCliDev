import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeUserForCookies } from "../../../lib/decodeUserForCookies";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  console.log("🍪 Received refresh token:", !!refreshToken);

  if (!refreshToken) {
    console.warn("⚠️ No refresh token found in cookies");
    return NextResponse.json({ message: "No refresh token present" }, { status: 200 });
  }

  try {
    const res = await fetch("https://idea-sphere-dev-30492dbf5e99.herokuapp.com/google/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });

    const data = await res.json();

    if (!res.ok || !data.accessToken) {
      console.error("❌ Refresh failed:", data.message || "Unknown error");
      return NextResponse.json({ message: data.message || "Refresh failed" }, { status: 401 });
    }

    const accessToken = data.accessToken;
    const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";

    // ✅ Decode user
    const user = decodeUserForCookies(accessToken);

    if (!user?.userId) {
      console.warn("❌ Invalid decoded user from refreshed token:", user);
      return NextResponse.json({ message: "Invalid token after refresh" }, { status: 401 });
    }

    const response = NextResponse.json(
      { message: "Refreshed successfully", userId: user.userId },
      { status: 200 }
    );

    // 🍪 ACCESS TOKEN
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "strict",
      path: "/",
      maxAge: 15 * 60, // 15 min
    });
    console.log("🍪 access_token refreshed (HttpOnly)");

    // 🍪 USER DATA
    const userData = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      status: user.status,
      unansweredCount: user.unansweredCount ?? 0,
    };

    response.cookies.set("user_data", JSON.stringify(userData), {
      httpOnly: false,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "strict",
      path: "/",
      maxAge: 15 * 60,
    });
    console.log("🍪 user_data refreshed (non-HttpOnly):", userData);

    console.log("✅ All refresh cookies updated successfully");
    return response;
  } catch (err: any) {
    console.error("❌ Error during refresh:", err.message);
    return NextResponse.json({ message: "Token refresh failed" }, { status: 500 });
  }
}

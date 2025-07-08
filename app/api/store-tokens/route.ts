import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeUserForCookies } from "../../../lib/decodeUserForCookies";

export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token } = await request.json();

    if (!access_token || !refresh_token) {
      console.warn("❌ Missing token data:", {
        access_token: !!access_token,
        refresh_token: !!refresh_token,
      });
      return NextResponse.json({ message: "Missing token data" }, { status: 400 });
    }

    const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";

    // ✅ Decode minimal user data for cookies
    const user = decodeUserForCookies(access_token);

    if (!user?.userId) {
      console.warn("❌ Invalid decoded user:", user);
      return NextResponse.json({ message: "Invalid access token" }, { status: 401 });
    }

    const response = NextResponse.json(
      { message: "Tokens stored", userId: user.userId },
      { status: 200 }
    );

    // 🍪 ACCESS TOKEN
    response.cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "strict",
      path: "/",
      maxAge: 15 * 60,
    });
    console.log("🍪 access_token set (HttpOnly)");

    // 🍪 REFRESH TOKEN
    response.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    console.log("🍪 refresh_token set (HttpOnly)");

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
    console.log("🍪 user_data set (non-HttpOnly)");

    console.log("✅ All cookies set and userId returned:", user.userId);
    return response;
  } catch (err: any) {
    console.error("❌ Error in store-tokens:", err.message);
    return NextResponse.json({ message: "Failed to store tokens" }, { status: 500 });
  }
}

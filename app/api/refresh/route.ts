import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getBaseUrl from "../../../lib/getBaseUrl";

export async function POST(request) {
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

    if (!backendRes.ok) {
      throw new Error("Backend refresh failed");
    }

    const { accessToken, userData } = await backendRes.json();

    // 🧼 Clean version of user data
    const cleanedUserData = {
      userId: userData.userId,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      status: userData.status,
      unanswered: userData.unanswered || [],
    };

    // ✅ Create response with new access_token
    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    });

    // ✅ DO NOT encode again — let Next.js encode the JSON string
    response.cookies.set("user_data", JSON.stringify(cleanedUserData), {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
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

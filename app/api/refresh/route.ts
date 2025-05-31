import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getBaseUrl from "../../../lib/getBaseUrl";

export async function POST() {
  // ✅ Await cookies
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    console.log("🔕 No refresh token found in cookies");
    return NextResponse.json(
      { message: "No refresh token present" },
      { status: 200 }
    );
  }

  try {
    const baseUrl = getBaseUrl();
    console.log("🌐 Refreshing token from backend:", `${baseUrl}/google/refresh`);

    const backendRes = await fetch(`${baseUrl}/google/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!backendRes.ok) throw new Error("Backend refresh failed");

    const { accessToken, userData } = await backendRes.json();

    const cleanedUserData = {
      userId: userData.userId || userData.googleId,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      status: userData.status,
      unanswered: userData.unanswered || [],
    };

    const response = NextResponse.json({
      accessToken,
      userData: cleanedUserData,
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("user_data", JSON.stringify(cleanedUserData), {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    console.log("🍪 Cookies updated successfully");
    return response;
  } catch (err: any) {
    console.error("❌ Refresh error:", err.message);

    const response = NextResponse.json(
      { message: "Refresh failed" },
      { status: 200 }
    );

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");

    return response;
  }
}

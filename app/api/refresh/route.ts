import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getBaseUrl from "../../../lib/getBaseUrl";

export async function POST() {
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

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("❌ Backend refresh failed:", errorText);
      throw new Error("Backend refresh failed");
    }

    const data = await backendRes.json();
    console.log("🧪 Raw response from backend:", data);

    if (!data.userData || !data.userData.userId) {
      throw new Error("userData is missing or malformed");
    }

    const { accessToken, userData } = data;

    const cleanedUserData = {
      userId: userData.userId,
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
      maxAge: 15 * 60, // 15 minutes
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

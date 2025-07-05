import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getBaseUrl from "../../../lib/getBaseUrl";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    console.log("🍪 Refresh token from cookies:", !!refreshToken);

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token present" }, { status: 200 });
    }

    const baseUrl = getBaseUrl();
    console.log("🌐 Calling backend refresh:", `${baseUrl}/google/refresh`);

    const backendRes = await fetch(`${baseUrl}/google/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const { accessToken, userData } = await backendRes.json();

    if (!accessToken || !userData) {
      console.warn("⚠️ Backend refresh returned incomplete data");
      return NextResponse.json({ message: "Incomplete token data" }, { status: 200 });
    }

    const isLocal = process.env.HOST === "LOCAL";

    const response = new NextResponse(
      JSON.stringify({
        message: "Tokens refreshed",
        accessToken,
        userData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    // ✅ Set access_token
    response.cookies.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "none",
      path: "/",
      maxAge: 15 * 60,
    });

    // ✅ Set refresh_token again
    response.cookies.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    const { userId, email, name, picture, status, unanswered } = userData;

    // ✅ Set raw (unencoded) JSON string
    response.cookies.set({
      name: "user_data",
      value: JSON.stringify({
        userId,
        email,
        name,
        picture,
        status,
      }),
      httpOnly: false,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "none",
      path: "/",
      maxAge: 15 * 60,
    });

    // ✅ Keep unanswered encoded, as it's a large array
    if (Array.isArray(unanswered)) {
      response.cookies.set({
        name: "unanswered",
        value: encodeURIComponent(JSON.stringify(unanswered)),
        httpOnly: false,
        secure: !isLocal,
        sameSite: isLocal ? "lax" : "none",
        path: "/",
        maxAge: 15 * 60,
      });
    } else {
      response.cookies.set("unanswered", "", {
        httpOnly: false,
        secure: !isLocal,
        sameSite: isLocal ? "lax" : "none",
        path: "/",
        maxAge: 0,
      });
    }

    console.log("✅ Refreshed cookies set successfully");
    return response;
  } catch (err) {
    console.error("❌ Refresh failed:", err.message);

    const response = new NextResponse(JSON.stringify({ message: "Refresh failed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");
    response.cookies.delete("unanswered");

    return response;
  }
}

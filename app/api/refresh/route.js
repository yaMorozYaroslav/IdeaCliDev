// /app/api/refresh-token/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const JWT_SECRET = process.env.JWT_SECRET || "test";
  const cookies = request.cookies || request.headers.get("cookie");

  const cookieMap = new Map(
    cookies?.split(";").map((c) => c.trim().split("="))
  );

  const refreshToken = cookieMap.get("refresh_token");
  const accessToken = cookieMap.get("access_token");

  const response = NextResponse.json({}, { status: 200 });

  if (!refreshToken) {
    console.error("❌ No refresh token");
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");
    return new NextResponse(JSON.stringify({ message: "No refresh token" }), {
      status: 401,
    });
  }

  try {
    const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET);

    // 🆕 Create a new access token
    const newAccessToken = jwt.sign(
      {
        name: decodedRefresh.name,
        email: decodedRefresh.email,
        picture: decodedRefresh.picture,
        userId: decodedRefresh.userId,
        status: decodedRefresh.status || "user",
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 🧼 Clean up old data
    response.cookies.delete("access_token");
    response.cookies.delete("user_data");

    // ✅ Set new access token
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 15 * 60,
    });

    // ✅ Set new user_data (frontend-accessible)
    const userData = {
      name: decodedRefresh.name,
      email: decodedRefresh.email,
      picture: decodedRefresh.picture,
      status: decodedRefresh.status,
      userId: decodedRefresh.userId,
    };

    response.cookies.set("user_data", JSON.stringify(userData), {
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return new NextResponse(JSON.stringify({ accessToken: newAccessToken }), {
      status: 200,
      headers: response.headers,
    });
  } catch (err) {
    console.error("❌ Failed to refresh:", err.message);

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    response.cookies.delete("user_data");

    return new NextResponse(JSON.stringify({ message: "Invalid refresh token" }), {
      status: 401,
    });
  }
}

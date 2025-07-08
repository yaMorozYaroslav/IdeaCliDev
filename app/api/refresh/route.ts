import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeUserForCookies } from "../../../lib/decodeUserForCookies";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  console.log("🍪 Refresh token from cookies:", !!refreshToken);

  if (!refreshToken) {
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
      throw new Error(data.message || "Refresh failed");
    }

    const accessToken = data.accessToken;
    const isLocal = process.env.LOCALHOST === "true" || process.env.NODE_ENV !== "production";

    const response = new NextResponse(JSON.stringify({ accessToken }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // 🍪 Set new access token
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: isLocal ? "lax" : "strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    // 🧠 Decode user data and set user_data cookie
    const user = decodeUserForCookies(accessToken);
    if (user?.userId) {
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

      console.log("👤 user_data updated after refresh:", userData);
    } else {
      console.warn("⚠️ Invalid decoded user during refresh");
    }

    console.log("🔁 Refreshed cookies returned");
    return response;
  } catch (err: any) {
    console.error("❌ Refresh error:", err.message);
    return NextResponse.json({ message: "Token refresh failed" }, { status: 401 });
  }
}

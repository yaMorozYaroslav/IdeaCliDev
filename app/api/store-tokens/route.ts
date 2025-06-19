// 🔄 Force dynamic execution (fix for Vercel caching issue)
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || "test");

    const userData = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      status: decoded.status,
      unanswered: decoded.unanswered || [],
    };

    const cookieStore = await cookies(); // ✅ Await the Promise
    const existingUserData = cookieStore.get("user_data");

    console.log("🔍 Existing user_data cookie:", existingUserData?.value);

    const redirectTo = `/${userData.userId}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            const target = "${redirectTo}";
            if (window.opener) {
              try {
                window.opener.location.href = target;
              } catch (err) {
                console.warn("🔁 Failed to redirect opener:", err);
              }
              window.close();
            } else {
              window.location.href = target;
            }
          </script>
        </body>
      </html>
    `;

    const response = new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });

    // 🍪 Store cookies
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("user_data", JSON.stringify(userData), {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    console.log("✅ Returning redirect response");
    return response;
  } catch (err) {
    console.error("❌ Failed to process tokens:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

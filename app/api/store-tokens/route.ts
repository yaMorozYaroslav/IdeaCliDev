import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || "test");

    // ✅ userId is now googleId
    const userData = {
      userId: decoded.userId, // this is the Google ID (sub)
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      status: decoded.status,
      unanswered: decoded.unanswered || [],
    };

    const cookieStore = await cookies();
    const existingUserData = cookieStore.get("user_data");
    console.log("🔍 Existing user_data cookie:", existingUserData?.value);

    // ✅ Redirect to profile page using Google ID
    const redirectTo = `/${userData.userId}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.location.href = "${redirectTo}";
              window.close();
            } else {
              window.location.href = "${redirectTo}";
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

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // ❌ Remove encodeURIComponent
response.cookies.set("user_data", JSON.stringify(userData), {
  httpOnly: false,
  secure: true,
  sameSite: "lax",
  maxAge: 15 * 60, // 15 minutes
  path: "/",
});


    return response;
  } catch (err) {
    console.error("❌ Failed to process tokens:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

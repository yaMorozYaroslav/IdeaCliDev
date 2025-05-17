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
    const slug = decoded.name.toLowerCase().replace(/\s+/g, "");

    const userData = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      status: decoded.status,
      slug,
      unanswered: decoded.unanswered || [],
    };

    const cookieStore = await cookies();
    const existingUserData = cookieStore.get("user_data");
    console.log("🔍 Existing user_data cookie:", existingUserData?.value);

    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.location.href = "/";
              window.close();
            } else {
              window.location.href = "/";
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
      sameSite: "strict", // ✅ FIXED
      maxAge: 15 * 60,
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict", // ✅ FIXED
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("user_data", encodeURIComponent(JSON.stringify(userData)), {
      httpOnly: false,
      secure: true,
      sameSite: "lax", // ✅ FIXED
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("❌ Failed to process tokens:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

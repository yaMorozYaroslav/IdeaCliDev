import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return new Response("Missing tokens", { status: 400 });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "test";
    const decoded = jwt.verify(accessToken, JWT_SECRET);

    const userData = {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
      status: decoded.status,
      userId: decoded.userId,
    };

    // ⛔ Now manually set cookies BEFORE returning the response
    const cookieStore = cookies();

    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    cookieStore.set("user_data", JSON.stringify(userData), {
      httpOnly: false,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 15 * 60,
    });

    // ✅ Then return the HTML
    return new Response(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ loginDone: true }, "*");
            }
            window.close();
          </script>
          <p>Login complete. You can close this window.</p>
        </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" },
    });

  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return new Response("Invalid token", { status: 401 });
  }
}

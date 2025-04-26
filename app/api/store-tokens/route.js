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

    // 🔥 Manually build Set-Cookie headers
    const setCookieHeaders = [
      `access_token=${accessToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${15 * 60}`,
      `refresh_token=${refreshToken}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
      `user_data=${encodeURIComponent(JSON.stringify(userData))}; Secure; Path=/; SameSite=Lax; Max-Age=${15 * 60}`,
    ];

    // ✅ Return custom HTML and manually attach cookies
    return new Response(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ loginDone: true }, "*");
            }
            window.close();
          </script>
          <p>Login complete! You can close this window.</p>
        </body>
      </html>
    `, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Set-Cookie": setCookieHeaders,
      },
    });

  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return new Response("Invalid token", { status: 401 });
  }
}

"use client";

import { useEffect } from "react";

export default function Popup() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    const storeTokensAndRedirect = async () => {
      if (!accessToken || !refreshToken) {
        console.warn("❌ Missing tokens in URL");
        return setTimeout(() => window.close(), 1500);
      }

      try {
        console.log("📥 Access + Refresh tokens from URL:", { accessToken, refreshToken });

        // 1️⃣ Store tokens as cookies
        const storeRes = await fetch("/api/store-tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
        });

        const storeData = await storeRes.json();
        console.log("📦 store-tokens status:", storeRes.status);
        console.log("📦 store-tokens response:", storeData);

        if (!storeRes.ok) throw new Error("❌ Failed to store tokens");

        // 2️⃣ Decode access token to get userId
        const payloadBase64 = accessToken.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const userId = decodedPayload?.userId;

        if (!userId) throw new Error("❌ Failed to extract userId from accessToken");

        // 3️⃣ Redirect parent window to /profiles/[userId]
        if (window.opener) {
          const redirectUrl = `/profiles/${userId}`;
          console.log("🔁 Redirecting opener to:", redirectUrl);
          window.opener.location.href = redirectUrl;
        }

        // 4️⃣ Close popup
        setTimeout(() => {
          console.log("🧨 Closing popup...");
          window.close();
        }, 300);
      } catch (err) {
        console.error("❌ Popup error:", err.message);
        setTimeout(() => window.close(), 2000);
      }
    };

    storeTokensAndRedirect();
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Login successful!</h2>
      <p>You are being redirected...</p>
    </div>
  );
}

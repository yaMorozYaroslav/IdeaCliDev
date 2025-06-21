"use client";

import { useEffect } from "react";

export default function Popup() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const userDataRaw = params.get("user_data");

    const storeTokensAndClose = async () => {
      if (accessToken && refreshToken && userDataRaw) {
        try {
          const userData = JSON.parse(decodeURIComponent(userDataRaw));

          // Send to opener window (optional)
          if (window.opener) {
            window.opener.postMessage(
              {
                type: "SET_TOKENS",
                accessToken,
                refreshToken,
                userData,
              },
              "*"
            );
            console.log("📤 Tokens sent to opener");
          }

          // Call API to set cookies
          const res = await fetch("/api/store-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              access_token: accessToken,
              refresh_token: refreshToken,
              user_data: userData,
            }),
          });

          if (!res.ok) {
            console.error("❌ Failed to store tokens:", res.status);
          } else {
            console.log("✅ Tokens stored via /api/store-tokens");
          }
        } catch (err) {
          console.error("❌ Error in popup:", err);
        }
      }

      // Close the window after token storage
      setTimeout(() => {
        window.close();
      }, 300);
    };

    storeTokensAndClose();
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Login successful!</h2>
      <p>You can close this window.</p>
    </div>
  );
}

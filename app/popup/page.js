"use client";

import { useEffect } from "react";

export default function Popup() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const userDataRaw = params.get("user_data");

    if (accessToken && refreshToken && userDataRaw) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataRaw));
        window.opener?.postMessage(
          {
            type: "SET_TOKENS",
            accessToken,
            refreshToken,
            userData,
          },
          "*"
        );
        console.log("📤 Tokens sent to opener");
      } catch (err) {
        console.error("❌ Error sending tokens to opener", err);
      }
    }

    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Login successful!</h2>
      <p>You can close this window.</p>
    </div>
  );
}

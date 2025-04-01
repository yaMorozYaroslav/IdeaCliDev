"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const refreshTimeoutRef = useRef(null);

  // ✅ Run only once on mount
  useEffect(() => {
    setMounted(true);
    scheduleTokenRefresh();

    // ✅ Clear timeout if component unmounts
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const scheduleTokenRefresh = () => {
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find((c) => c.startsWith("user_data="));
    if (!userCookie) return;

    try {
      const rawData = decodeURIComponent(userCookie.split("=")[1]);
      const userData = JSON.parse(rawData);

      if (!userData?.exp) return;

      const now = Math.floor(Date.now() / 1000);
      const refreshTime = (userData.exp - 60) - now; // ⏰ 1 minute before expiry

      if (refreshTime <= 0) {
        console.log("🔄 Token already near expiry. Refreshing immediately...");
        refreshToken();
      } else {
        console.log(`⏳ Scheduling token refresh in ${refreshTime}s`);
        refreshTimeoutRef.current = setTimeout(() => {
          refreshToken();
        }, refreshTime * 1000);
      }
    } catch (err) {
      console.error("❌ Failed to parse user_data or schedule refresh:", err);
    }
  };

  const refreshToken = async () => {
    try {
      console.log("🔁 Refreshing access token...");
      await fetch("/api/refresh-token", { method: "POST" });
      scheduleTokenRefresh(); // ⏱️ Schedule next refresh after successful one
    } catch (err) {
      console.error("❌ Token refresh failed:", err);
    }
  };

  if (!mounted) return null;

  return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
      <Header user={user} />
      {children}
    </StyleSheetManager>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const refreshTimeoutRef = useRef(null);
  const REFRESH_INTERVAL = 13 * 60 * 1000; // 13 minutes

  useEffect(() => {
  setMounted(true);

  // 🔄 Trigger refresh immediately on mount
  console.log("🚀 Checking for access token on mount...");
  refreshToken(); // Will attempt refresh even if access_token is missing

  // 🔁 Start scheduled refresh cycle
  startRefreshCycle();
  console.log("⏰ First scheduled refresh set at:", new Date().toLocaleTimeString());

  return () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
  };
}, []);


  const startRefreshCycle = () => {
    refreshTimeoutRef.current = setTimeout(() => {
      console.log("🚀 Timer fired at:", new Date().toLocaleTimeString());
      refreshToken();
    }, REFRESH_INTERVAL);
  };

  const refreshToken = async (retry = true) => {
    try {
      const res = await fetch("/api/refresh", {
        method: "POST",
        credentials: "include", // important
      });
      const data = await res.json();

      if (data.message === "No refresh token present") {
        console.log("🟡 No refresh token. Not restarting refresh cycle.");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Refresh failed");
      }

      console.log("✅ Token refresh successful!");

      // Dispatch tokenRefreshed event
      window.dispatchEvent(new Event("tokenRefreshed"));

      // Restart cycle after successful refresh
      startRefreshCycle();
    } catch (err) {
      console.error("❌ Error during token refresh:", err.message);

      // Optional retry once if failed
      if (retry) {
        console.warn("🔄 Retrying refresh in 5 seconds...");
        setTimeout(() => refreshToken(false), 5000); // retry once after 5s
      } else {
        console.error("❌ Refresh retry also failed. Giving up.");
      }
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

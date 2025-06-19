"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const refreshTimeoutRef = useRef(null);
  const REFRESH_INTERVAL = 1 * 60 * 1000; // 1 minute

  useEffect(() => {
    setMounted(true);

    // 🔄 Trigger refresh immediately on mount
    console.log("🚀 Checking for access token on mount...");
    refreshToken();

    // 🔁 Start scheduled refresh cycle
    startRefreshCycle();
    console.log("⏰ First scheduled refresh set at:", new Date().toLocaleTimeString());

    // 📥 Listen for postMessage from popup
    const handleMessage = async (event) => {
      if (event.data?.type === "SET_TOKENS") {
        try {
          await fetch("/api/store-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event.data),
          });

          console.log("✅ Tokens sent to backend and cookies set");
          window.location.href = `/${event.data.userData.userId}`;
        } catch (err) {
          console.error("❌ Failed to store tokens in cookies:", err);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      window.removeEventListener("message", handleMessage);
    };
  }, [user]);

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
        credentials: "include",
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
      window.dispatchEvent(new Event("tokenRefreshed"));
      startRefreshCycle();
    } catch (err) {
      console.error("❌ Error during token refresh:", err.message);
      if (retry) {
        console.warn("🔄 Retrying refresh in 5 seconds...");
        setTimeout(() => refreshToken(false), 5000);
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

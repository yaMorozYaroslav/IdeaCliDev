"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const refreshTimeoutRef = useRef(null);
  const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

  useEffect(() => {
    setMounted(true);
    startRefreshCycle();
    console.log("⏰ Refresh scheduled at:", new Date().toLocaleTimeString());

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const startRefreshCycle = () => {
    refreshTimeoutRef.current = setTimeout(() => {
      refreshToken();
    }, REFRESH_INTERVAL);
  };

  const refreshToken = async () => {
    try {
      console.log("🔁 Refreshing access token...");
      await fetch("/api/refresh-token", { method: "POST" });
      startRefreshCycle(); // Schedule next refresh after successful one
    } catch (err) {
      console.error("❌ Token refresh failed:", err);
      // Optionally redirect or clear UI here
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

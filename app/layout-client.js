"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const refreshTimeoutRef = useRef(null);
  const REFRESH_INTERVAL = 0.5 * 60 * 1000; // 14 minutes in milliseconds

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
    console.log("🚀 Timer fired at:", new Date().toLocaleTimeString()); // ✅ add this
    refreshToken();
  }, REFRESH_INTERVAL);
};

  const refreshToken = async () => {
  try {
    const res = await fetch("/api/refresh", { method: "POST" });
    const data = await res.json();

    if (data.message === "No refresh token present") {
      console.log("🟡 No refresh token. Not restarting refresh cycle.");
      return;
    }

    if (!res.ok) {
      throw new Error(data.message || "Refresh failed");
    }

    startRefreshCycle();
  } catch (err) {
    console.error("❌ Error during token refresh:", err);
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

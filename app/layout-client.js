"use client";

import { useEffect, useState, useRef } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import Cookies from "js-cookie";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const [rehydratedUser, setRehydratedUser] = useState(user);
  const refreshTimer = useRef(null);

  // Handle login token setting from popup
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data?.type === "SET_TOKENS") {
        try {
          const { accessToken, refreshToken } = event.data;

          await fetch("/api/store-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
          });

          console.log("✅ Tokens stored via /api/store-tokens");
          window.location.href = window.location.pathname;
        } catch (err) {
          console.error("❌ Failed to store tokens:", err);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Rehydrate user from user_data cookie
  useEffect(() => {
    try {
      const raw = Cookies.get("user_data");
      if (raw) {
        const parsed = JSON.parse(raw);
        setRehydratedUser(parsed);
        console.log("🔁 Rehydrated user from cookie:", parsed);
      }
    } catch (err) {
      console.warn("❌ Failed to parse user_data:", err);
    }

    setMounted(true);
  }, []);

  // 🔁 Setup refresh logic
  useEffect(() => {
    const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
    const INITIAL_DELAY = 30 * 1000; // 30 seconds

    const triggerRefresh = async () => {
      console.log("🔄 Attempting token refresh...");
      try {
        const res = await fetch("/api/refresh", { method: "POST" });
        const data = await res.json();

        if (!res.ok) {
          console.warn("⚠️ Refresh returned error:", data.message);
        } else {
          console.log("✅ Token refreshed successfully:", data);
        }
      } catch (err) {
        console.error("❌ Refresh request failed:", err);
      }
    };

    const startRefreshLoop = () => {
      console.log(`⏱️ Starting refresh loop: first in 30s, then every 14m`);
      triggerRefresh(); // first call
      refreshTimer.current = setInterval(triggerRefresh, REFRESH_INTERVAL);
    };

    const firstTimeout = setTimeout(startRefreshLoop, INITIAL_DELAY);

    return () => {
      clearTimeout(firstTimeout);
      if (refreshTimer.current) clearInterval(refreshTimer.current);
      console.log("🛑 Refresh loop cleared");
    };
  }, []);

  if (!mounted) return null;

  return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
      <Header user={rehydratedUser} />
      {children}
    </StyleSheetManager>
  );
}

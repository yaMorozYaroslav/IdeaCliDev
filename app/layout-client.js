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

  // ✅ Handle token from popup
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

          console.log("✅ Tokens stored from popup");
          window.location.href = window.location.pathname;
        } catch (err) {
          console.error("❌ Failed to store tokens:", err);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ✅ Rehydrate user from cookie
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

  // ✅ Refresh loop + wake/resume detection
  useEffect(() => {
    const REFRESH_INTERVAL = 14 * 60 * 1000;
    const INITIAL_DELAY = 30 * 1000;
    const AWAY_THRESHOLD = 10 * 60 * 1000;

    const triggerRefresh = async (reason) => {
  console.log(`🔄 Attempting token refresh${reason ? ` (${reason})` : ""}`);
  try {
    const res = await fetch("/api/refresh", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      console.warn("⚠️ Refresh failed:", data.message);
    } else {
      console.log("✅ Token refreshed:", data);
    }
  } catch (err) {
    console.error("❌ Refresh error:", err);
  }
};


    const startLoop = () => {
      triggerRefresh("initial after 30s");
      refreshTimer.current = setInterval(() => triggerRefresh("interval"), REFRESH_INTERVAL);
      console.log("⏱️ Refresh interval set");
    };

    const timeout = setTimeout(startLoop, INITIAL_DELAY);

    // 🕹️ Update activity timestamp on interaction
    const markActive = () => {
      sessionStorage.setItem("lastActive", Date.now().toString());
    };

    // ⏪ Resume detection
    const onResume = () => {
      const last = sessionStorage.getItem("lastActive");
      const now = Date.now();
      if (last && now - parseInt(last) > AWAY_THRESHOLD) {
        console.log("🕑 Resumed after long absence");
        triggerRefresh("resume");
      }
      markActive();
    };

    // Start with initial timestamp
    markActive();

    window.addEventListener("focus", onResume);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        onResume();
      }
    });

    // Update activity on user input
    document.addEventListener("mousemove", markActive);
    document.addEventListener("keydown", markActive);
    document.addEventListener("click", markActive);

    return () => {
      clearTimeout(timeout);
      if (refreshTimer.current) clearInterval(refreshTimer.current);
      window.removeEventListener("focus", onResume);
      document.removeEventListener("visibilitychange", onResume);
      document.removeEventListener("mousemove", markActive);
      document.removeEventListener("keydown", markActive);
      document.removeEventListener("click", markActive);
      console.log("🛑 Cleaned up refresh loop");
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

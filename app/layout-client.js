"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const refreshTimeoutRef = useRef(null);
  const REFRESH_INTERVAL = 1 * 60 * 1000;

  useEffect(() => {
    setMounted(true);

    console.log("🔍 Initial cookies:", document.cookie);
    waitForRefreshToken();

    // Setup periodic refresh
    startRefreshCycle();
    console.log("⏰ First scheduled refresh set at:", new Date().toLocaleTimeString());

    const handleMessage = async (event) => {
      if (event.data?.type === "SET_TOKENS") {
        try {
          await fetch("/api/store-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event.data),
          });

          console.log("✅ Tokens sent to backend and cookies set");

          // ✅ Delay before redirect to ensure cookies are committed
          setTimeout(() => {
            console.log("➡️ Redirecting to profile page");
            window.location.href = `/profiles/${event.data.userData.userId}`;
          }, 300);
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

  const waitForRefreshToken = () => {
    const hasRefresh = document.cookie.includes("refresh_token=");

    if (!hasRefresh) {
      console.warn("⏳ Waiting for refresh_token cookie...");
      setTimeout(() => {
        waitForRefreshToken(); // retry until cookie appears
      }, 200);
    } else {
      console.log("✅ refresh_token found, starting refresh now");
      refreshToken();
    }
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

      if (!res.ok || !data.accessToken) {
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

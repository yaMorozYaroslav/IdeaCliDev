"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import Cookies from "js-cookie";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const refreshTimeoutRef = useRef(null);
  const REFRESH_INTERVAL = 1 * 60 * 1000;

  useEffect(() => {
    setMounted(true);
    console.log("🔍 Initial cookies:", document.cookie);

    waitForRefreshToken();
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

  const waitForRefreshToken = async () => {
    for (let i = 0; i < 10; i++) {
      const refresh = Cookies.get("refresh_token");
      const access = Cookies.get("access_token");
      const userData = Cookies.get("user_data");

      if (!refresh && (!access || !userData)) {
        console.log("🚪 User is logged out — stopping refresh loop");
        return;
      }

      if (refresh) {
        console.log("✅ refresh_token found, starting refresh now");
        await refreshToken();
        return;
      }

      console.warn("⏳ Waiting for refresh_token cookie...");
      await new Promise((r) => setTimeout(r, 200));
    }

    console.warn("⛔ Gave up waiting for refresh_token after 10 tries");
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

      if (data.userData) {
        Cookies.set("user_data", JSON.stringify(data.userData), {
          expires: new Date(Date.now() + 15 * 60 * 1000),
          path: "/",
        });
      }

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

"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import Cookies from "js-cookie";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const [unanswered, setUnanswered] = useState([]);
  const refreshTimeoutRef = useRef(null);
  const REFRESH_INTERVAL = 1 * 60 * 1000;

  useEffect(() => {
    try {
      const raw = Cookies.get("unanswered");
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw));
        setUnanswered(parsed);
        console.log("📦 Loaded unanswered from cookie:", parsed);
      }
    } catch (err) {
      console.error("❌ Failed to parse unanswered cookie:", err);
    }

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

      if (!refresh) {
        console.log("🚪 No refresh token — stopping refresh loop");
        return;
      }

      const access = Cookies.get("access_token");
      const userData = Cookies.get("user_data");

      if (!access || !userData) {
        console.warn("⏳ Missing access or user data — triggering immediate refresh");
        await refreshToken();
        return;
      }

      console.log("🟢 All tokens present, skipping immediate refresh");
      return;
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
        // ✅ Strip unanswered before saving user_data
        const { unanswered, ...safeUserData } = data.userData;

        Cookies.set("user_data", JSON.stringify(safeUserData), {
          expires: new Date(Date.now() + 15 * 60 * 1000),
          path: "/",
        });

        if (Array.isArray(unanswered) && unanswered.length > 0) {
          Cookies.set("unanswered", encodeURIComponent(JSON.stringify(unanswered)), {
            expires: new Date(Date.now() + 15 * 60 * 1000),
            path: "/",
          });
          setUnanswered(unanswered);
        } else {
          Cookies.remove("unanswered");
          setUnanswered([]);
        }
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
      <Header user={user} unanswered={unanswered} />
      {children}
    </StyleSheetManager>
  );
}

// app/layout-client.js
"use client";

import { useEffect, useState, useRef } from "react";
import Header from "../comps/Header";

// ESM/CJS-safe import for styled-components v6
import * as StyledComponents from "styled-components";
const styled = StyledComponents.default || StyledComponents;
const { StyleSheetManager } = StyledComponents;

import isPropValid from "@emotion/is-prop-valid";
import Cookies from "js-cookie";
import GlobalStyle from "./GlobalStyle";

const FullPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: 300px) {
    min-height: 100dvh; /* use dynamic viewport height on tiny screens */
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 50px; /* enough to clear the fixed header */
`;

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const [rehydratedUser, setRehydratedUser] = useState(user);

  const refreshTimer = useRef(null);
  const lastRefreshAtRef = useRef(Date.now());

  // new: robust "away" detection via hidden timer
  const needsRefreshRef = useRef(false);
  const hiddenTimerRef = useRef(null);

  // handle tokens from popup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = async (event) => {
      if (event?.data?.type !== "SET_TOKENS") return;
      try {
        const { accessToken, refreshToken } = event.data || {};
        if (!accessToken || !refreshToken) return;

        if (typeof fetch !== "undefined") {
          await fetch("/api/store-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token: accessToken,
              refresh_token: refreshToken,
            }),
          });
        }

        // Reload to let SSR pick up new cookies
        window.location.href = window.location.pathname;
      } catch (err) {
        console.error("❌ Failed to store tokens:", err);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // rehydrate user from cookie
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

  // refresh loop and resume handling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const REFRESH_INTERVAL = 14 * 60 * 1000;
    const AWAY_THRESHOLD = 10 * 60 * 1000;

    const triggerRefresh = async (reason) => {
      console.log(`🔄 Attempting token refresh${reason ? ` (${reason})` : ""}`);
      try {
        if (typeof fetch === "undefined") return;

        const res = await fetch("/api/refresh", { method: "POST" });
        let data = null;
        try {
          data = await res.json();
        } catch {
          // not all test mocks return JSON
        }

        if (!res.ok) {
          console.warn("⚠️ Refresh failed:", data?.message);
        } else {
          console.log("✅ Token refreshed");
          lastRefreshAtRef.current = Date.now();

          if (data?.userData) {
            setRehydratedUser(data.userData);
            try {
              Cookies.set("user_data", JSON.stringify(data.userData), { path: "/" });
            } catch {
              /* cookie might be blocked in some envs */
            }
            console.log("📦 User updated directly from refresh response:", data.userData);
          } else {
            const raw = Cookies.get("user_data");
            if (raw) {
              const parsed = JSON.parse(raw);
              setRehydratedUser(parsed);
              console.log("🔁 Fallback rehydrated user from cookie:", parsed);
            }
          }

          try {
            window.dispatchEvent(new Event("tokenRefreshed"));
          } catch {
            /* ignore in tests */
          }
        }
      } catch (err) {
        console.error("❌ Refresh error:", err);
      }
    };

    // activity tracking (for your existing logic)
    const markActive = () => {
      try {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("lastActive", Date.now().toString());
        }
      } catch {
        /* ignore */
      }
      // clearing the hidden timer on activity prevents accidental flips while visible
      clearHiddenTimer();
    };

    // hidden timer machinery
    const armHiddenTimer = () => {
      clearHiddenTimer();
      hiddenTimerRef.current = window.setTimeout(() => {
        needsRefreshRef.current = true;
      }, AWAY_THRESHOLD);
    };

    const clearHiddenTimer = () => {
      if (hiddenTimerRef.current != null) {
        clearTimeout(hiddenTimerRef.current);
        hiddenTimerRef.current = null;
      }
    };

    const maybeRefreshNow = () => {
      // once we become visible/focused, if we were away long enough, refresh
      clearHiddenTimer();
      if (needsRefreshRef.current) {
        needsRefreshRef.current = false;
        void triggerRefresh("resume");
        return;
      }

      // fallback: also consider time since last activity/refresh
      try {
        const raw = sessionStorage.getItem("lastActive");
        const lastActive = raw ? parseInt(raw, 10) : 0;
        const now = Date.now();
        const awayByActivity = lastActive && now - lastActive > AWAY_THRESHOLD;
        const awayByTimeSinceRefresh = now - lastRefreshAtRef.current > AWAY_THRESHOLD;

        if (awayByActivity || awayByTimeSinceRefresh) {
          console.log("🕑 Resumed after long absence (fallback)");
          void triggerRefresh("resume-fallback");
        }
      } catch {
        /* ignore */
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        armHiddenTimer();
      } else {
        maybeRefreshNow();
      }
    };

    const onFocus = () => {
      // focusing window should check the flag too
      maybeRefreshNow();
    };

    // pageshow fires on bfcache/tab restore; good moment to test for resume
    const onPageShow = () => {
      maybeRefreshNow();
    };

    const startLoop = () => {
      // initial refresh to normalize state
      void triggerRefresh("initial");
      refreshTimer.current = setInterval(() => void triggerRefresh("interval"), REFRESH_INTERVAL);
      console.log("⏱️ Refresh interval set");
    };

    startLoop();
    markActive();

    // if mounting while hidden (e.g., test toggled), arm the timer immediately
    if (document.hidden) armHiddenTimer();

    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);

    document.addEventListener("mousemove", markActive);
    document.addEventListener("keydown", markActive);
    document.addEventListener("click", markActive);

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      document.removeEventListener("mousemove", markActive);
      document.removeEventListener("keydown", markActive);
      document.removeEventListener("click", markActive);

      clearHiddenTimer();
      console.log("🛑 Cleaned up refresh loop");
    };
  }, []);

  if (!mounted) return null;

  return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
      <>
        <GlobalStyle />
        <FullPageWrapper>
          <Header user={rehydratedUser} />
          <MainContent>{children}</MainContent>
        </FullPageWrapper>
      </>
    </StyleSheetManager>
  );
}

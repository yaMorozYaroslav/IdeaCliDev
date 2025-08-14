// app/layout-client.js
"use client";

import { useEffect, useRef, useState } from "react";
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
    min-height: 100dvh;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 50px;
`;

const safeParse = (v) => {
  if (!v) return null;
  try {
    return JSON.parse(v);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(v));
    } catch {
      return null;
    }
  }
};

const isValidUser = (u) => !!u && (u.googleId || u.userId);

export default function LayoutClient({ user, children }) {
  // Only trust SSR user if it has an id; otherwise start as null
  const [mounted, setMounted] = useState(false);
  const [rehydratedUser, setRehydratedUser] = useState(() =>
    isValidUser(user) ? user : null
  );

  const refreshTimer = useRef(null);
  const lastRefreshAtRef = useRef(Date.now());

  const needsRefreshRef = useRef(false);
  const hiddenTimerRef = useRef(null);

  // Handle tokens from popup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = async (event) => {
      if (event?.data?.type !== "SET_TOKENS") return;
      try {
        const { accessToken, refreshToken } = event.data || {};
        if (!accessToken || !refreshToken) return;

        await fetch("/api/store-tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
        });

        // Reload to let SSR pick up new cookies
        window.location.href = window.location.pathname;
      } catch (err) {
        console.error("❌ Failed to store tokens:", err);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Optional: one-time cookie rehydrate, but only if cookie includes an id
  useEffect(() => {
    if (isValidUser(rehydratedUser)) {
      setMounted(true);
      return;
    }
    const parsed = safeParse(Cookies.get("user_data"));
    if (isValidUser(parsed)) {
      setRehydratedUser(parsed);
      console.log("🔁 Rehydrated user from cookie:", parsed);
    }
    setMounted(true);
  }, []); // once

  // Refresh loop and resume handling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const REFRESH_INTERVAL = 14 * 60 * 1000;
    const AWAY_THRESHOLD = 10 * 60 * 1000;

    const triggerRefresh = async (reason) => {
      try {
        const res = await fetch("/api/refresh", { method: "POST" });
        let data = null;
        try {
          data = await res.json();
        } catch {
          // tests may not return JSON
        }

        if (!res.ok) {
          console.warn("⚠️ Refresh failed:", data?.message);
        } else {
          lastRefreshAtRef.current = Date.now();

          // Only adopt user if it has an id; else clear it
          if (isValidUser(data?.userData)) {
            setRehydratedUser(data.userData);
            try {
              Cookies.set("user_data", JSON.stringify(data.userData), { path: "/" });
            } catch {}
          } else {
            setRehydratedUser(null);
            try {
              Cookies.remove("user_data", { path: "/" });
            } catch {}
          }

          try {
            window.dispatchEvent(new Event("tokenRefreshed"));
          } catch {}
        }
      } catch (err) {
        console.error("❌ Refresh error:", err);
      }
    };

    const clearHiddenTimer = () => {
      if (hiddenTimerRef.current != null) {
        clearTimeout(hiddenTimerRef.current);
        hiddenTimerRef.current = null;
      }
    };
    const armHiddenTimer = () => {
      clearHiddenTimer();
      hiddenTimerRef.current = window.setTimeout(() => {
        needsRefreshRef.current = true;
      }, AWAY_THRESHOLD);
    };

    const markActive = () => {
      try {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem("lastActive", Date.now().toString());
        }
      } catch {}
      clearHiddenTimer();
    };

    const maybeRefreshNow = () => {
      clearHiddenTimer();
      if (needsRefreshRef.current) {
        needsRefreshRef.current = false;
        void triggerRefresh("resume");
        return;
      }
      try {
        const raw = sessionStorage.getItem("lastActive");
        const lastActive = raw ? parseInt(raw, 10) : 0;
        const now = Date.now();
        const awayByActivity = lastActive && now - lastActive > AWAY_THRESHOLD;
        const awayByTimeSinceRefresh = now - lastRefreshAtRef.current > AWAY_THRESHOLD;
        if (awayByActivity || awayByTimeSinceRefresh) {
          void triggerRefresh("resume-fallback");
        }
      } catch {}
    };

    const onVisibilityChange = () => {
      if (document.hidden) armHiddenTimer();
      else maybeRefreshNow();
    };
    const onFocus = () => maybeRefreshNow();
    const onPageShow = () => maybeRefreshNow();

    const startLoop = () => {
      void triggerRefresh("initial");
      refreshTimer.current = setInterval(
        () => void triggerRefresh("interval"),
        REFRESH_INTERVAL
      );
    };

    startLoop();
    markActive();

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

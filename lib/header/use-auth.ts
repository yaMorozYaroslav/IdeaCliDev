// lib/header/use-auth.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import getBaseUrl from "@/lib/getBaseUrl";
import { safeParse } from "./safe-parse";
import { User, isValidUser } from "./user-type";

// --- useAuthUser ------------------------------------------------------------
export function useAuthUser(initial: User | null) {
  const [currentUser, setCurrentUser] = useState<User | null>(
    isValidUser(initial) ? initial : null
  );
  const isAuthed = !!(currentUser?.googleId || currentUser?.userId);

  // hydrate from cookie if not already authed
  useEffect(() => {
    if (isAuthed) return;
    const parsed = safeParse<User>(Cookies.get("user_data"));
    if (isValidUser(parsed)) setCurrentUser(parsed);
  }, [isAuthed]);

  // react to custom tokenRefreshed
  useEffect(() => {
    const update = () => {
      const parsed = safeParse<User>(Cookies.get("user_data"));
      setCurrentUser(isValidUser(parsed) ? parsed : null);
    };
    window.addEventListener("tokenRefreshed", update);
    return () => window.removeEventListener("tokenRefreshed", update);
  }, []);

  return { currentUser, setCurrentUser, isAuthed };
}

// --- useAuthActions ---------------------------------------------------------
export function useAuthActions(setCurrentUser: (u: User | null) => void) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = useCallback(() => {
    const baseUrl = getBaseUrl();
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirect = `${baseUrl}/google/oauth/callback`;
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(clientId || "")}` +
      `&redirect_uri=${encodeURIComponent(redirect)}` +
      `&response_type=code&scope=openid%20email%20profile`;

    setIsLoggingIn(true);
    const popup = window.open(authUrl, "oauthPopup", "width=500,height=600");

    if (!popup) {
      setIsLoggingIn(false);
      return;
    }
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.loginDone) {
        setIsLoggingIn(false);
        window.removeEventListener("message", handleMessage);
        window.location.reload();
      }
    };
    window.addEventListener("message", handleMessage);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}
    try {
      Cookies.remove("user_data", { path: "/" });
    } catch {}
    setCurrentUser(null);
    window.dispatchEvent(new Event("tokenRefreshed"));
    window.location.reload();
  }, [setCurrentUser]);

  return { login, logout, isLoggingIn };
}

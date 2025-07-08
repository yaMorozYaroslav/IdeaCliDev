"use client";

import { useEffect, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import Cookies from "js-cookie";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);
  const [rehydratedUser, setRehydratedUser] = useState(user);

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

          // More graceful than full reload:
          window.location.href = window.location.pathname;
        } catch (err) {
          console.error("❌ Failed to store tokens:", err);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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

  if (!mounted) return null;

  return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
      <Header user={rehydratedUser} />
      {children}
    </StyleSheetManager>
  );
}

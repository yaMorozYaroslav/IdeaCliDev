"use client";

import { useEffect, useState } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

export default function LayoutClient({ user, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data?.type === "SET_TOKENS") {
        try {
          const { accessToken, refreshToken: rToken } = event.data;

          await fetch("/api/store-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token: accessToken,
              refresh_token: rToken,
            }),
          });

          console.log("✅ Tokens sent to backend and cookies set");
          window.location.reload(); // force reload so layout.js refetches user from token
        } catch (err) {
          console.error("❌ Failed to store tokens in cookies:", err);
        }
      }
    };

    setMounted(true);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (!mounted) return null;

  return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
      <Header user={user} />
      {children}
    </StyleSheetManager>
  );
}

"use client";

import { useState, useEffect } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { usePathname } from "next/navigation";

export default function LayoutClient({ user, children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔁 Trigger on path change
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const cookies = document.cookie.split("; ");
      const userCookie = cookies.find((c) => c.startsWith("user_data="));
      if (!userCookie) return;

      try {
        const rawData = decodeURIComponent(userCookie.split("=")[1]);
        const userData = JSON.parse(rawData);

        // If the user_data includes an exp (expiration), check it
        // You might be storing exp in seconds (UNIX timestamp)
        if (userData?.exp) {
          const now = Math.floor(Date.now() / 1000);
          const remaining = userData.exp - now;

          if (remaining < 15 * 60) {
            console.log("🔄 Token expiring soon. Refreshing...");
            await fetch("/api/refresh-token", { method: "POST" });
          } else {
            console.log(`⏳ Token still valid (${remaining}s left)`);
          }
        }
      } catch (err) {
        console.error("❌ Failed to parse user_data or refresh:", err);
      }
    };

    checkAndRefreshToken();
  }, [pathname]); // Runs every time the route/path changes

  if (!mounted) return null;

  return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
      <Header user={user} />
      {children}
    </StyleSheetManager>
  );
}

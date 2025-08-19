// lib/client/hooks/useHeaderVisibility.ts
"use client";
import { useEffect, useState } from "react";
export function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(y <= lastY);
          setLastY(y);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return { isVisible };
}

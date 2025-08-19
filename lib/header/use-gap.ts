// lib/header/use-gap.ts
"use client";
import { RefObject, useEffect } from "react";
export function useHeaderGap(ref: RefObject<HTMLElement>, isVisible: boolean) {
  useEffect(() => {
    const setGap = () => {
      const h = ref.current ? Math.round(ref.current.getBoundingClientRect().height) : 0;
      document.documentElement.style.setProperty("--header-gap", isVisible ? `${h}px` : "0px");
    };

    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window && ref.current) {
      ro = new ResizeObserver(setGap);
      ro.observe(ref.current);
    }

    setGap();
    const onResize = () => setGap();
    const onScroll = () => setGap();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (ro && ref.current) ro.unobserve(ref.current);
    };
  }, [ref, isVisible]);
}

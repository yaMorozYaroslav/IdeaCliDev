// lib/header/use-width.ts
"use client";
import { useEffect, useState } from "react";
export function useScreenWidth() {
  const [w, setW] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

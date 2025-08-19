// lib/header/safeParse.ts
export function safeParse<T = any>(v?: string | null): T | null {
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
}

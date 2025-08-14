// lib/profile-client.ts
"use client";

import Cookies from "js-cookie";
import { getUserFromCookies } from "../cookies/getUserFromCookies";

export interface ProfileUser {
  userId?: string;
  googleId?: string;
  _id?: string;
  name?: string;
  email?: string;
  picture?: string;
  status?: string;
  answered?: unknown[];
  unanswered?: unknown[];
  unansweredCount?: number;
  [k: string]: unknown;
}

export const TOKEN_REFRESHED_EVENT = "tokenRefreshed" as const;
export const REFRESH_COOLDOWN_MS = 8000 as const;

export const safeParseJSON = <T = unknown>(v?: string | null): T | null => {
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
};

export const readCookieUser = (): ProfileUser | null => {
  try {
    const u = getUserFromCookies() as unknown;
    return u && typeof u === "object" ? (u as ProfileUser) : null;
  } catch {
    return safeParseJSON<ProfileUser>(Cookies.get("user_data"));
  }
};

export const extractId = (u?: ProfileUser | null): string | null =>
  (u?.googleId as string | undefined) ||
  (u?.userId as string | undefined) ||
  (u?._id as string | undefined) ||
  null;

export const computeOwnerIds = (cookieUser: ProfileUser | null, routeId: string) => {
  const currentUserId = extractId(cookieUser);
  const isOwner = !!currentUserId && String(currentUserId) === String(routeId);
  return { currentUserId, isOwner };
};

export const sameArrayLen = (a?: unknown[], b?: unknown[]): boolean =>
  (a?.length || 0) === (b?.length || 0);

export const sameId = (a?: ProfileUser | null, b?: ProfileUser | null): boolean =>
  String(extractId(a)) === String(extractId(b));

export const sameUserShallow = (a?: ProfileUser | null, b?: ProfileUser | null): boolean =>
  sameId(a, b) &&
  a?.name === b?.name &&
  a?.picture === b?.picture &&
  a?.status === b?.status &&
  (a?.unanswered?.length ?? a?.unansweredCount ?? 0) ===
    (b?.unanswered?.length ?? b?.unansweredCount ?? 0) &&
  (a?.answered?.length ?? 0) === (b?.answered?.length ?? 0);

export const fetchProfile = async (
  profileUserId: string,
  opts: { signal?: AbortSignal } = {}
): Promise<ProfileUser | null> => {
  const res = await fetch("/api/refresh-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: profileUserId }),
    cache: "no-store",
    signal: opts.signal,
  });
  const payload: { ok?: boolean; profile?: ProfileUser; message?: string } | null =
    await res.json().catch(() => null);

  if (!res.ok || !payload?.ok) {
    const message = payload?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return payload.profile ?? null;
};

export const updateUserDataCookieFromProfile = (updated?: ProfileUser | null): void => {
  const id = updated?.userId || updated?.googleId;
  if (!id) return;
  try {
    Cookies.set(
      "user_data",
      JSON.stringify({
        userId: id,
        email: updated?.email ?? null,
        name: updated?.name ?? null,
        picture: updated?.picture ?? null,
        status: updated?.status ?? null,
        unansweredCount: Array.isArray(updated?.unanswered) ? updated!.unanswered!.length : 0,
      }),
      { path: "/", sameSite: "Lax" }
    );
  } catch {
    // ignore cookie write failures (blocked, etc.)
  }
};

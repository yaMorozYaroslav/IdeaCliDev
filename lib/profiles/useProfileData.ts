// lib/useProfileData.ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  TOKEN_REFRESHED_EVENT,
  REFRESH_COOLDOWN_MS,
  readCookieUser,
  computeOwnerIds,
  sameArrayLen,
  sameUserShallow,
  fetchProfile,
  updateUserDataCookieFromProfile,
  type ProfileUser,
} from "./profile-client";

export interface UseProfileDataArgs {
  profileUserId: string;
  user?: ProfileUser | null;
  initialUnanswered?: unknown[];
}

export interface UseProfileDataResult {
  hydratedUser: ProfileUser | null;
  answered: unknown[];
  unanswered: unknown[];
  isOwner: boolean;
  currentUserId: string | null;
  triggerRefresh: () => void;
}

export function useProfileData({
  profileUserId,
  user,
  initialUnanswered = [],
}: UseProfileDataArgs): UseProfileDataResult {
  const [hydratedUser, setHydratedUser] = useState<ProfileUser | null>(user || null);
  const [answered, setAnswered] = useState<unknown[]>(user?.answered || []);
  const [unanswered, setUnanswered] = useState<unknown[]>(initialUnanswered);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const isOwnerRef = useRef<boolean>(false);
  const refreshingRef = useRef<boolean>(false);
  const lastRefreshAtRef = useRef<number>(0);

  useEffect(() => {
    const cookieUser = readCookieUser();
    const { currentUserId: cid, isOwner: owner } = computeOwnerIds(cookieUser, profileUserId);
    setCurrentUserId(cid);
    setIsOwner(owner);
    isOwnerRef.current = owner;
  }, [profileUserId]);

  const refreshProfileCb = useCallback(async () => {
    if (refreshingRef.current) return;
    const now = Date.now();
    if (now - lastRefreshAtRef.current < REFRESH_COOLDOWN_MS) return;

    refreshingRef.current = true;
    try {
      const updated = await fetchProfile(profileUserId);

      setHydratedUser((prev) => (sameUserShallow(prev, updated) ? prev : updated ?? null));

      setAnswered((prev) =>
        sameArrayLen(prev as unknown[], updated?.answered) ? prev : (updated?.answered || [])
      );

      if (isOwnerRef.current) {
        setUnanswered((prev) =>
          sameArrayLen(prev as unknown[], updated?.unanswered) ? prev : (updated?.unanswered || [])
        );
      }

      updateUserDataCookieFromProfile(updated);
    } catch (err) {
      // soft-fail: keep UI state; log for debugging
      // eslint-disable-next-line no-console
      console.warn("❌ Failed to refresh profile:", (err as Error)?.message || err);
    } finally {
      refreshingRef.current = false;
      lastRefreshAtRef.current = Date.now();
    }
  }, [profileUserId]);

  useEffect(() => {
    if (isOwnerRef.current) void refreshProfileCb();
  }, [refreshProfileCb, isOwner]);

  useEffect(() => {
    const onTokenRefreshed = () => {
      const cookieUser = readCookieUser();
      const { currentUserId: cid, isOwner: owner } = computeOwnerIds(cookieUser, profileUserId);
      setCurrentUserId(cid);
      setIsOwner(owner);
      isOwnerRef.current = owner;
      if (owner) void refreshProfileCb();
    };
    window.addEventListener(TOKEN_REFRESHED_EVENT, onTokenRefreshed as EventListener);
    return () =>
      window.removeEventListener(TOKEN_REFRESHED_EVENT, onTokenRefreshed as EventListener);
  }, [profileUserId, refreshProfileCb]);

  useEffect(() => {
    const onFocus = () => {
      if (isOwnerRef.current) void refreshProfileCb();
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onFocus as EventListener);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onFocus as EventListener);
    };
  }, [refreshProfileCb]);

  const triggerRefresh = useCallback(() => {
    void refreshProfileCb();
  }, [refreshProfileCb]);

  return {
    hydratedUser,
    answered,
    unanswered,
    isOwner,
    currentUserId,
    triggerRefresh,
  };
}

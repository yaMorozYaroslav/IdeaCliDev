"use client";

import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import AskPersonalWrapper from "./AskPersonalWrapper";
import ProfileHeader from "./ProfileHeader";
import UnansweredList from "./UnansweredList";
import AnsweredList from "./AnsweredList";
import Cookies from "js-cookie";
import { getUserFromCookies } from "../../../lib/getUserFromCookies";

export default function ClientUserProfile({
  userId: profileUserId,
  user,
  initialUnanswered = [],
}) {
  const [answered, setAnswered] = useState(user?.answered || []);
  const [unanswered, setUnanswered] = useState(initialUnanswered);
  const [hydratedUser, setHydratedUser] = useState(user || null);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // guards to prevent rapid or overlapping refreshes
  const isOwnerRef = useRef(false);
  const refreshingRef = useRef(false);
  const lastRefreshAtRef = useRef(0);
  const REFRESH_COOLDOWN_MS = 8000; // minimal gap between refreshes

  const readCookieUser = () => {
    try {
      const u = getUserFromCookies();
      return u && typeof u === "object" ? u : null;
    } catch {
      try {
        const raw = Cookies.get("user_data");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
  };

  const computeIsOwner = (cookieUser, routeId) => {
    const cid = cookieUser?.googleId || cookieUser?.userId || null;
    setCurrentUserId(cid);
    const owner = !!cid && String(cid) === String(routeId);
    setIsOwner(owner);
    isOwnerRef.current = owner;
  };

  // Utility: shallow guards so we only set state when it actually changes
  const sameId = (a, b) => {
    const aId = a?.googleId || a?.userId || a?._id || null;
    const bId = b?.googleId || b?.userId || b?._id || null;
    return String(aId) === String(bId);
  };
  const sameUserShallow = (a, b) =>
    sameId(a, b) &&
    a?.name === b?.name &&
    a?.picture === b?.picture &&
    a?.status === b?.status &&
    (a?.unanswered?.length ?? a?.unansweredCount ?? 0) ===
      (b?.unanswered?.length ?? b?.unansweredCount ?? 0) &&
    (a?.answered?.length ?? 0) === (b?.answered?.length ?? 0);

  const sameArrayLen = (a = [], b = []) => (a?.length || 0) === (b?.length || 0);

  // detect current user on mount / route change (no polling)
  useEffect(() => {
    const cookieUser = readCookieUser();
    computeIsOwner(cookieUser, profileUserId);
  }, [profileUserId]);

  const refreshProfile = async () => {
    // throttle
    if (refreshingRef.current) return;
    const now = Date.now();
    if (now - lastRefreshAtRef.current < REFRESH_COOLDOWN_MS) return;

    refreshingRef.current = true;
    try {
      const res = await fetch("/api/refresh-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profileUserId }),
        cache: "no-store",
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.ok) {
        console.warn("❌ Failed to refresh profile:", res.status, payload?.message);
        return;
      }

      const updated = payload.profile || null;

      // Update main user object only if changed
      setHydratedUser((prev) => (sameUserShallow(prev, updated) ? prev : updated));

      // Update answered if length changed (cheap guard)
      setAnswered((prev) => (sameArrayLen(prev, updated?.answered) ? prev : (updated?.answered || [])));

      // Update unanswered only for owner (and only if length changed)
      if (isOwnerRef.current) {
        setUnanswered((prev) =>
          sameArrayLen(prev, updated?.unanswered) ? prev : (updated?.unanswered || [])
        );
      }

      // Optional: update user_data for header badge; do NOT dispatch tokenRefreshed here
      if (updated?.userId || updated?.googleId) {
        try {
          Cookies.set(
            "user_data",
            JSON.stringify({
              userId: updated.userId || updated.googleId,
              email: updated.email,
              name: updated.name,
              picture: updated.picture,
              status: updated.status,
              unansweredCount: updated.unanswered?.length ?? 0,
            }),
            { path: "/" }
          );
        } catch {}
      }
    } catch (err) {
      console.error("❌ Error refreshing user:", err);
    } finally {
      refreshingRef.current = false;
      lastRefreshAtRef.current = Date.now();
    }
  };

  // first load: if owner, try to upgrade to include private fields
  useEffect(() => {
    if (isOwnerRef.current) refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  // react to global token refreshes (event fired by layout/header on login/logout/refresh)
  useEffect(() => {
    const onTokenRefreshed = () => {
      const cookieUser = readCookieUser();
      computeIsOwner(cookieUser, profileUserId);
      if (isOwnerRef.current) refreshProfile();
      // if logged out, isOwner becomes false here; no need for polling
    };
    window.addEventListener("tokenRefreshed", onTokenRefreshed);
    return () => window.removeEventListener("tokenRefreshed", onTokenRefreshed);
  }, [profileUserId]);

  // refresh when returning from absence (no polling)
  useEffect(() => {
    const onFocus = () => {
      if (isOwnerRef.current) refreshProfile();
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onFocus);
    };
  }, []);

  // manual refresh trigger from children
  useEffect(() => {
    if (needsRefresh) {
      refreshProfile().finally(() => setNeedsRefresh(false));
    }
  }, [needsRefresh]);

  const triggerRefresh = () => setNeedsRefresh(true);

  return (
    <ContentWrapper>
      <ProfileHeader user={hydratedUser} isOwner={isOwner} />

      {!isOwner && (
        <AskPersonalWrapper
          profileUserId={profileUserId}
          currentUserId={currentUserId}
          isOwner={false}
        />
      )}

      {isOwner && (
        <UnansweredList
          unanswered={unanswered}
          user={hydratedUser}
          isOwner={true}
          onDelete={triggerRefresh}
          onAnswered={triggerRefresh}
        />
      )}

      <AnsweredList
        answered={answered}
        user={hydratedUser}
        isOwner={isOwner}
        loading={false}
        onDelete={triggerRefresh}
      />
    </ContentWrapper>
  );
}

const ContentWrapper = styled.div`
  margin-top: 30px;
  padding-top: 0;
   @media (max-width: 768px) {
      margin-top: 0px; /* adjust to match your mobile header height */
    }
`;

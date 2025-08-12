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
  const [hydratedUser, setHydratedUser] = useState(user);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const isOwnerRef = useRef(false);

  // ✅ Detect current user
  useEffect(() => {
    const cookieUser = getUserFromCookies();
    if (cookieUser?.userId) {
      const owner = cookieUser.userId === profileUserId;
      setCurrentUserId(cookieUser.userId);
      setIsOwner(owner);
      isOwnerRef.current = owner;
    } else {
      setCurrentUserId(null);
      setIsOwner(false);
      isOwnerRef.current = false;
    }
  }, [profileUserId]);

  // ✅ Watch for logout (cookie deletion)
  useEffect(() => {
    const interval = setInterval(() => {
      const stillExists = document.cookie.includes("user_data=");
      if (!stillExists) {
        setIsOwner(false);
        isOwnerRef.current = false;
        setCurrentUserId(null);
        setUnanswered([]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Rehydration logic from API route + cookie + token refresh
  const refresh = async () => {
    try {
      const res = await fetch("/api/refresh-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profileUserId }),
      });

      if (!res.ok) {
        console.warn("❌ Failed to refresh profile:", res.status);
        return;
      }

      const updated = await res.json();
      if (!updated || typeof updated !== "object") {
        console.warn("❌ Invalid user data received during refresh:", updated);
        return;
      }

      setHydratedUser(updated);
      setAnswered(updated.answered || []);

      if (isOwnerRef.current && updated.unanswered) {
        setUnanswered(updated.unanswered);
      }

      // ✅ Update user_data cookie
      if (updated.userId) {
        Cookies.set(
          "user_data",
          JSON.stringify({
            userId: updated.userId,
            email: updated.email,
            name: updated.name,
            picture: updated.picture,
            status: updated.status,
            unansweredCount: updated.unanswered?.length ?? 0,
          }),
          { path: "/" }
        );
      }

      // ✅ Refresh token + HttpOnly access_token + synced cookie
      const tokenRes = await fetch("/api/refresh", { method: "POST" });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) {
        console.warn("⚠️ Token refresh failed after profile update:", tokenData.message);
      }

      // ✅ Let Header and others know
      window.dispatchEvent(new Event("tokenRefreshed"));
    } catch (err) {
      console.error("❌ Error refreshing user:", err);
    }
  };

  // ✅ SSR first-load hydration
  useEffect(() => {
    refresh();
  }, []);

  // ✅ Manual rehydration after actions
  useEffect(() => {
    if (needsRefresh) {
      refresh().finally(() => setNeedsRefresh(false));
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
  margin-top: 30px;   /* was 180px */
  padding-top: 0;  /* keep flush with layout/main offset */
`;

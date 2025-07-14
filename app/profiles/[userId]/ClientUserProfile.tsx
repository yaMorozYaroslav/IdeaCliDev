"use client";

import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import AskPersonalWrapper from "./AskPersonalWrapper";
import ProfileHeader from "./ProfileHeader";
import UnansweredList from "./UnansweredList";
import AnsweredList from "./AnsweredList";
import { getUserFromCookies } from "../../../lib/getUserFromCookies";
import Cookies from "js-cookie";

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

  // ✅ Rehydration logic from API route
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

        // 🍪 Update unanswered cookie
        Cookies.set("unanswered", JSON.stringify(updated.unanswered), {
          path: "/",
          sameSite: "strict",
        });

        // 🍪 Update user_data count
        const raw = Cookies.get("user_data");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            parsed.unanswered = updated.unanswered.length;
            Cookies.set("user_data", JSON.stringify(parsed), {
              path: "/",
              sameSite: "strict",
            });
          } catch (err) {
            console.warn("⚠️ Failed to update user_data cookie:", err);
          }
        }
      }
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
  margin-top: 180px;
`;

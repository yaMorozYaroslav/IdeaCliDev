"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import AskPersonalWrapper from "./AskPersonalWrapper";
import ProfileHeader from "./ProfileHeader";
import UnansweredList from "./UnansweredList";
import AnsweredList from "./AnsweredList";

export default function ClientUserProfile({
  userId: profileUserId,
  user,
  initialUnanswered = [],
}: {
  userId: string;
  user: any;
  initialUnanswered?: any[];
}) {
  const [unanswered, setUnanswered] = useState(initialUnanswered);
  const [answered, setAnswered] = useState(user?.answered || []);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log("🍪 Full document.cookie:", document.cookie);

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="));

    if (cookie) {
      try {
        const raw = cookie.split("=")[1];
        if (!raw) throw new Error("Empty cookie value");

        const decoded = decodeURIComponent(raw);
        const parsed = JSON.parse(decoded);

        const userIdFromCookie = parsed?.userId;
        if (userIdFromCookie) {
          setCurrentUserId(userIdFromCookie);
          setIsOwner(userIdFromCookie === profileUserId);
          return;
        } else {
          console.warn("⚠️ user_data cookie found, but userId is missing");
        }
      } catch (err) {
        console.warn("❌ Failed to parse user_data cookie:", err);
      }
    }

    // Fallback if no valid cookie
    setCurrentUserId(null);
    setIsOwner(false);
  }, [profileUserId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const hasCookie = document.cookie
        .split("; ")
        .some((c) => c.startsWith("user_data="));
      if (!hasCookie) {
        setIsOwner(false);
        setUnanswered([]);
        setCurrentUserId(null);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ContentWrapper>
      <ProfileHeader user={user} isOwner={isOwner} />

      <AskPersonalWrapper
        profileUserId={profileUserId}
        currentUserId={currentUserId}
        isOwner={isOwner}
      />

      {isOwner && (
        <UnansweredList
          unanswered={unanswered}
          user={user}
          isOwner={isOwner}
          onDelete={() => setUnanswered((prev) => [...prev])}
          onAnswered={() =>
            setUnanswered((prev) => prev.filter((q) => q.status !== "answered"))
          }
        />
      )}

      <AnsweredList
        answered={answered}
        user={user}
        isOwner={isOwner}
        loading={false}
        onDelete={(id) =>
          setAnswered((prev) => prev.filter((q) => q._id !== id))
        }
      />
    </ContentWrapper>
  );
}

const ContentWrapper = styled.div`
  margin-top: 180px;
`;

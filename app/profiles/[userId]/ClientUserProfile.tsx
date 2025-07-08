"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import AskPersonalWrapper from "./AskPersonalWrapper";
import ProfileHeader from "./ProfileHeader";
import UnansweredList from "./UnansweredList";
import AnsweredList from "./AnsweredList";
import { getUserFromCookies } from "../../../lib/getUserFromCookies";

export default function ClientUserProfile({
  userId: profileUserId,
  user,
  initialUnanswered = [],
}: {
  userId: string;
  user: any;
  initialUnanswered?: any[];
}) {
  const [answered, setAnswered] = useState(user?.answered || []);
  const [unanswered, setUnanswered] = useState(initialUnanswered);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Detect if the logged-in user is viewing their own profile
  useEffect(() => {
    const cookieUser = getUserFromCookies();
    if (cookieUser?.userId) {
      setCurrentUserId(cookieUser.userId);
      setIsOwner(cookieUser.userId === profileUserId);
    } else {
      setCurrentUserId(null);
      setIsOwner(false);
    }
  }, [profileUserId]);

  // Auto-clear on logout or cookie expiration
  useEffect(() => {
    const interval = setInterval(() => {
      const stillExists = document.cookie.includes("user_data=");
      if (!stillExists) {
        setIsOwner(false);
        setCurrentUserId(null);
        setUnanswered([]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ContentWrapper>
      <ProfileHeader user={user} isOwner={isOwner} />

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
          user={user}
          isOwner={true}
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

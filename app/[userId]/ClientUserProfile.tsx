"use client";

import { useEffect, useState } from "react";
import getBaseUrl from "../../lib/getBaseUrl";
import AskPersonalWrapper from "./AskPersonalWrapper";
import ProfileHeader from "./ProfileHeader";
import UnansweredList from "./UnansweredList";
import AnsweredList from "./AnsweredList";
import styled from "styled-components";

export default function ClientUserProfile({
  userId: profileUserId,
  user,
  initialUnanswered = [],
}: {
  userId: string;
  user: any;
  initialUnanswered?: any[];
}) {
  const [answered, setAnswered] = useState([]);
  const [unanswered, setUnanswered] = useState(initialUnanswered);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 🍪 Extract current user ID from cookie
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="));

    if (cookie) {
      try {
        const raw = decodeURIComponent(cookie.split("=")[1]);
        const parsed = JSON.parse(raw);
        const userIdFromCookie = parsed?.userId;

        if (userIdFromCookie) {
          setCurrentUserId(userIdFromCookie);
          setIsOwner(userIdFromCookie === profileUserId);
          return;
        }
      } catch {
        // Ignore cookie parsing error
      }
    }

    setCurrentUserId(null);
    setIsOwner(false);
  }, [profileUserId]);

  // 🧠 Fetch answered (and possibly unanswered) questions via POST
  useEffect(() => {
    const fetchAnswered = async () => {
      setLoadingAnswers(true);
      await new Promise((res) => setTimeout(res, 300));

      try {
        const res = await fetch(`${getBaseUrl()}/google/public/${profileUserId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requesterId: currentUserId,
          }),
        });

        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }

        const data = await res.json();
        setAnswered(data?.answered || []);
        if (data?.unanswered && Array.isArray(data.unanswered)) {
          setUnanswered(data.unanswered);
        }
      } catch (err) {
        console.error("❌ Failed to load answered questions:", err);
        setAnswered([]);
      } finally {
        setLoadingAnswers(false);
      }
    };

    // ✅ Wait for currentUserId to be resolved first (even if it's null)
    if (currentUserId !== undefined) {
      fetchAnswered();
    }
  }, [profileUserId, currentUserId]);

  // 🔄 Clear state on logout
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

      {loadingAnswers ? (
        <Spinner>Loading answered...</Spinner>
      ) : (
        <AnsweredList
          answered={answered}
          user={user}
          isOwner={isOwner}
          loading={loadingAnswers}
          onDelete={(id) =>
            setAnswered((prev) => prev.filter((q) => q._id !== id))
          }
        />
      )}
    </ContentWrapper>
  );
}

const Spinner = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const ContentWrapper = styled.div`
  margin-top: 180px;
`;

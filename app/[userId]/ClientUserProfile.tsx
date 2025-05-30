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

  // 🍪 Check user_data cookie only if it exists
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
        // fail silently and fall through to anonymous
      }
    }

    // fallback if no cookie or parse failed
    setCurrentUserId(null);
    setIsOwner(false);
  }, [profileUserId]);

  // 🧠 Fetch answered questions from backend
  useEffect(() => {
    const fetchAnswered = async () => {
      setLoadingAnswers(true);
      await new Promise((res) => setTimeout(res, 300));

      try {
        const res = await fetch(`${getBaseUrl()}/google/public/${profileUserId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ requesterId: currentUserId }),
});


        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }

        const data = await res.json();
        setAnswered(data?.answered || []);
      } catch (err) {
        console.error("❌ Failed to load answered questions:", err);
        setAnswered([]);
      } finally {
        setLoadingAnswers(false);
      }
    };

    fetchAnswered();
  }, [profileUserId, currentUserId]);

  // 🔄 Watch for logout to clear personal data
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

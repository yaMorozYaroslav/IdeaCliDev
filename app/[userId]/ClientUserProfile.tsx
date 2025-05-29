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

  // 🍪 Check cookie to detect viewer identity
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="));

    if (cookie) {
      try {
        const raw = decodeURIComponent(cookie.split("=")[1]);
        const parsed = JSON.parse(raw);
        const userIdFromCookie = parsed?.userId;

        setCurrentUserId(userIdFromCookie);
        setIsOwner(userIdFromCookie === profileUserId);
      } catch {
        setIsOwner(false);
        setCurrentUserId(null);
      }
    } else {
      setIsOwner(false);
      setCurrentUserId(null);
    }
  }, []);

  // 🧠 Fetch answered questions after short delay
  useEffect(() => {
    const fetchAnswered = async () => {
      setLoadingAnswers(true);
      await new Promise((res) => setTimeout(res, 300)); // ⏱️ delay before fetch

      try {
        const res = await fetch(`${getBaseUrl()}/google/public/${profileUserId}`, {
          method: "POST",
        });
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
  }, [profileUserId]);

  // 🔄 Watch for logout and clear unanswered list
  useEffect(() => {
    const interval = setInterval(() => {
      const hasCookie = document.cookie
        .split("; ")
        .some((c) => c.startsWith("user_data="));
      if (!hasCookie) {
        setIsOwner(false);
        setUnanswered([]); // Clear personal data
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
      <UnansweredList
        unanswered={unanswered}
        user={user}
        isOwner={isOwner}
        onDelete={() => setUnanswered((prev) => [...prev])}
        onAnswered={() =>
          setUnanswered((prev) => prev.filter((q) => q.status !== "answered"))
        }
      />
      {loadingAnswers ? (
        <Spinner>Loading answered...</Spinner>
      ) : (
        <AnsweredList answered={answered} user={user} />
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
  margin-top: 180px; /* Adjust if your header is taller */
`;

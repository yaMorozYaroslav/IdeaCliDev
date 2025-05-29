"use client";

import { useEffect, useState } from "react";
import getBaseUrl from "../../lib/getBaseUrl";
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
        const id = parsed?.userId || null;
        setCurrentUserId(id);
        setIsOwner(id === profileUserId);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, [profileUserId]);

  // 🎯 Fetch answered on mount
  useEffect(() => {
    const fetchAnswered = async () => {
      setLoadingAnswers(true);
      try {
        const res = await fetch(`${getBaseUrl()}/google/public/${profileUserId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requesterId: currentUserId }),
        });

        const text = await res.text();
        const data = JSON.parse(text);

        if (res.ok) {
          setAnswered((data.answered || []).filter((q: any) => q?.title));
        }
      } catch (err) {
        console.error("❌ Failed to load answered:", err);
      } finally {
        setLoadingAnswers(false);
      }
    };

    if (currentUserId !== null) fetchAnswered();
  }, [profileUserId, currentUserId]);

  return (
    <div
      style={{
        padding: "2rem",
        marginTop: typeof window !== "undefined" && window.innerWidth < 800 ? "140px" : "100px",
      }}
    >
      {currentUserId && currentUserId !== profileUserId && (
        <AskPersonalWrapper recipientUserId={profileUserId} />
      )}

      {user && <ProfileHeader user={user} />}

      <UnansweredList
        unanswered={unanswered}
        user={user}
        isOwner={isOwner}
        onDelete={() => {}}
        onAnswered={() => {}}
      />

      <AnsweredList
        answered={answered}
        user={user}
        isOwner={isOwner}
        loading={loadingAnswers}
        onDelete={() => {}}
      />
    </div>
  );
}

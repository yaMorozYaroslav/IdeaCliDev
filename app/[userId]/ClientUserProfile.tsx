"use client";

import { useEffect, useState } from "react";
import getBaseUrl from "../../lib/getBaseUrl";
import AskPersonalButton from "./AskPersonalButton";

export default function ClientUserProfile({ userId: profileUserId }) {
  const [user, setUser] = useState(null);
  const [unanswered, setUnanswered] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("pending");

  // 🍪 Load user_data cookie
  const getCurrentUserIdFromCookie = () => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_data="));
      if (!cookie) return null;

      const raw = decodeURIComponent(cookie.split("=")[1]);
      const parsed = JSON.parse(raw);
      return parsed?.userId || null;
    } catch {
      return null;
    }
  };

  // 🔄 Re-check user cookie every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newId = getCurrentUserIdFromCookie();
      setCurrentUserId((prev) => (prev !== newId ? newId : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 📦 Re-fetch profile if current user or profile changes
  useEffect(() => {
    if (currentUserId !== "pending") {
      fetchProfileData();
    }
  }, [currentUserId, profileUserId]);

  const fetchProfileData = async () => {
    try {
      const res = await fetch(`${getBaseUrl}/google/public/${profileUserId}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ requesterId: currentUserId }), // <-- From cookie or state
});


      if (!res.ok) throw new Error("Failed to load user profile");

      const data = await res.json();

      setUser({
        name: data.name,
        picture: data.picture,
        googleId: data.googleId,
        status: data.status,
      });

      setAnswered((data.answered || []).filter((q) => q?.title));
      setUnanswered((data.unanswered || []).filter((q) => q?.title));
      setIsOwner(currentUserId === profileUserId);
    } catch (err) {
      console.error("❌ Error loading profile:", err);
    }
  };

  const handleAnswer = async (questionId) => {
    const content = prompt("Your answer:");
    if (!content) return;

    const res = await fetch(`${getBaseUrl()}/personal/answer/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        userId: user?.googleId,
      }),
      credentials: "include",
    });

    if (res.ok) {
      await fetchProfileData();
    } else {
      const err = await res.json();
      alert(`❌ Failed to answer: ${err.message}`);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const res = await fetch(`${getBaseUrl()}/personal/${questionId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setUnanswered((prev) => prev.filter((q) => q._id !== questionId));
      setAnswered((prev) => prev.filter((q) => q._id !== questionId));
    } else {
      const error = await res.text();
      console.error(`❌ Failed to delete question (${res.status}):`, error);
      alert(`Failed to delete question: ${res.status}\n${error}`);
    }
  };

  const handleDeleteAnswer = async (questionId, answerId) => {
    const res = await fetch(`${getBaseUrl()}/questions/${questionId}/answers/${answerId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.googleId }),
      credentials: "include",
    });

    if (res.ok) {
      await fetchProfileData();
    }
  };

  const canDeleteQuestion = (q) => {
    return (
      q?.authorId === user?.googleId ||
      isOwner ||
      user?.status === "admin"
    );
  };

  const canDeleteAnswer = (a) => {
    return (
      a?.authorId === user?.googleId ||
      isOwner ||
      user?.status === "admin"
    );
  };

  return (
    <div style={{ padding: "2rem", marginTop: "100px" }}>
      {/* 🔘 Ask button visible to non-owner */}
      {!isOwner && profileUserId && (
        <div style={{ marginBottom: "2rem" }}>
          <AskPersonalButton recipientUserId={profileUserId} />
        </div>
      )}

      {/* 👤 Profile Info */}
      {user && (
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          {user.picture && (
            <img src={user.picture} alt={user.name} style={{ width: 48, height: 48, borderRadius: "50%" }} />
          )}
          <strong>{user.name}</strong>
        </div>
      )}

      {/* ❓ Unanswered questions — only for profile owner */}
      {isOwner && (
        <>
          <h2>Unanswered Questions</h2>
          {unanswered.length === 0 && <p>No unanswered questions</p>}
          {unanswered.map((q) =>
            q?.title ? (
              <div key={q._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                <p><strong>{q.title}</strong></p>
                <p style={{ fontSize: "0.9em", color: "#666" }}>by {q.authorName}</p>

                <button onClick={() => handleAnswer(q._id)}>Answer</button>

                {canDeleteQuestion(q) && (
                  <button onClick={() => handleDeleteQuestion(q._id)}>Delete Question</button>
                )}
              </div>
            ) : null
          )}
        </>
      )}

      {/* ✅ Answered questions */}
      <h2>Answered Questions</h2>
      {answered.length === 0 && <p>No answered questions</p>}
      {answered.map((q) =>
        q?.title ? (
          <div key={q._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
            <p><strong>{q.title}</strong></p>
            <p style={{ fontSize: "0.9em", color: "#666" }}>by {q.authorName}</p>

{q.answer && (
  <div style={{ marginTop: "1rem", paddingLeft: "1rem", borderLeft: "3px solid #333" }}>
    <p>💬 {q.answer}</p>
    <p style={{ fontSize: "0.8em", color: "#999" }}>— {user?.name || "Anonymous"}</p>
  </div>
)}


            {canDeleteQuestion(q) && (
              <button onClick={() => handleDeleteQuestion(q._id)}>Delete Question</button>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}

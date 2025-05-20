"use client";

import { useEffect, useState } from "react";
import getBaseUrl from "../../lib/getBaseUrl";
import AskPersonalButton from "./AskPersonalButton";

export default function ClientUserProfile({ userId: profileUserId }) {
  const [user, setUser] = useState(null);
  const [unanswered, setUnanswered] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/google/public/${profileUserId}`, {
        cache: "no-store",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load user profile");

      const data = await res.json();

      setUser({
        name: data.name,
        picture: data.picture,
        googleId: data.googleId,
        status: data.status,
      });

      setAnswered(data.answered || []);
      setUnanswered(data.unanswered || []);
      setIsOwner(data.isOwner);
    } catch (err) {
      console.error("❌ Error loading profile:", err);
    }
  };

  const handleAnswer = async (questionId) => {
    const content = prompt("Your answer:");
    if (!content) return;

    const res = await fetch(`${getBaseUrl()}/questions/${questionId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        userId: user?.googleId,
        name: user?.name,
      }),
      credentials: "include",
    });

    if (res.ok) {
      const answer = await res.json();
      const moved = unanswered.find(q => q._id === questionId);
      if (moved) {
        moved.answers = [answer];
        setUnanswered(prev => prev.filter(q => q._id !== questionId));
        setAnswered(prev => [moved, ...prev]);
      }
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const res = await fetch(`${getBaseUrl()}/personal/${questionId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setUnanswered(prev => prev.filter(q => q._id !== questionId));
      setAnswered(prev => prev.filter(q => q._id !== questionId));
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
      setAnswered(prev =>
        prev.map(q =>
          q._id === questionId
            ? { ...q, answers: q.answers.filter(a => a._id !== answerId) }
            : q
        )
      );
    }
  };

  const canDeleteQuestion = (q) => {
    return (
      q.authorId === user?.googleId ||
      isOwner ||
      user?.status === "admin"
    );
  };

  const canDeleteAnswer = (a) => {
    return (
      a.authorId === user?.googleId ||
      isOwner ||
      user?.status === "admin"
    );
  };

  return (
    <div style={{ padding: "2rem", marginTop: "100px" }}>
      {/* ✅ Ask button: visible to all except profile owner */}
      {!isOwner && profileUserId && (
        <div style={{ marginBottom: "2rem" }}>
          <AskPersonalButton recipientUserId={profileUserId} />
        </div>
      )}

      {/* ✅ Profile avatar and name */}
      {user && (
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          {user.picture && (
            <img src={user.picture} alt={user.name} style={{ width: 48, height: 48, borderRadius: "50%" }} />
          )}
          <strong>{user.name}</strong>
        </div>
      )}

      <h2>Unanswered Questions</h2>
      {unanswered.length === 0 && <p>No unanswered questions</p>}
      {unanswered.map((q) => (
        <div key={q._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <p><strong>{q.title}</strong></p>
          <p style={{ fontSize: "0.9em", color: "#666" }}>by {q.authorName}</p>

          {isOwner && (
            <button onClick={() => handleAnswer(q._id)}>Answer</button>
          )}

          {canDeleteQuestion(q) && (
            <button onClick={() => handleDeleteQuestion(q._id)}>Delete Question</button>
          )}
        </div>
      ))}

      <h2>Answered Questions</h2>
      {answered.length === 0 && <p>No answered questions</p>}
      {answered.map((q) => (
        <div key={q._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <p><strong>{q.title}</strong></p>
          <p style={{ fontSize: "0.9em", color: "#666" }}>by {q.authorName}</p>

          {q.answers.map(a => (
            <div key={a._id} style={{ marginTop: "1rem", paddingLeft: "1rem", borderLeft: "3px solid #333" }}>
              <p>💬 {a.content}</p>
              <p style={{ fontSize: "0.8em", color: "#999" }}>— {a.authorName}</p>
              {canDeleteAnswer(a) && (
                <button onClick={() => handleDeleteAnswer(q._id, a._id)}>Delete Answer</button>
              )}
            </div>
          ))}

          {canDeleteQuestion(q) && (
            <button onClick={() => handleDeleteQuestion(q._id)}>Delete Question</button>
          )}
        </div>
      ))}
    </div>
  );
}

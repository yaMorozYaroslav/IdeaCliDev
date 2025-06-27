"use client";

import { useState, useEffect } from "react";
import getBaseUrl from "../../../lib/getBaseUrl";

export default function AskPersonalButton({ recipientUserId }: { recipientUserId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  // ✅ Check if current user is the profile owner
  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^| )user_data=([^;]*)/);
      if (!match) return setIsOwner(false);

      const decoded = decodeURIComponent(match[1]);
      const user = JSON.parse(decoded);
      if (user?.userId === recipientUserId) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } catch (err) {
      console.error("❌ Failed to parse user_data cookie:", err);
      setIsOwner(false);
    }
  }, [recipientUserId]);

  const handleSend = async () => {
    if (!question.trim()) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch(`${getBaseUrl()}/personal/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: question, recipientUserId }),
        credentials: "include",
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      setSent(true);
      setQuestion("");
    } catch (err) {
      console.error("❌ Failed to send question:", err);
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  // ⛔ Don’t show if it’s the owner
  if (isOwner === true) return null;

  if (sent) {
    return <p style={{ marginTop: "1rem" }}>✅ Your question has been sent!</p>;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      {!showForm ? (
        <button onClick={() => setShowForm(true)}>Ask a personal question</button>
      ) : (
        <>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Type your question..."
            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          />
          <br />
          <button onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>
          {error && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>❌ {error}</p>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import getBaseUrl from "../../lib/getBaseUrl";

export default function AskPersonalQuestion({ recipientUserId }: { recipientUserId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`${getBaseUrl()}/personal/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: question, recipientUsername: recipientUserId }),
        credentials: "include",
      });

      if (!res.ok) throw new Error(await res.text());

      setSent(true);
      setQuestion("");
    } catch (err) {
      console.error("❌ Failed to send question:", err);
    } finally {
      setSending(false);
    }
  };

  if (sent) return <p style={{ marginTop: "1rem" }}>✅ Your question has been sent!</p>;

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
        </>
      )}
    </div>
  );
}

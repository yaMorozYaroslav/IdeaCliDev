"use client";

import { useState } from "react";
import getBaseUrl from "../../lib/getBaseUrl";

interface Props {
  recipientUserId: string; // now googleId
}

export default function AskPersonalButton({ recipientUserId }: Props) {
  const [question, setQuestion] = useState("");

  async function handleClick() {
    if (!question.trim()) return alert("Enter a question first");

    try {
      const res = await fetch(`${getBaseUrl()}/personal/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: question,
          recipientUserId, // ✅ googleId
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      alert("Question sent!");
      setQuestion("");
    } catch (err: any) {
      console.error("❌ Failed to send question:", err);
      alert("Failed to send question: " + err.message);
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a personal question"
        rows={3}
        style={{ width: "100%", padding: "0.5rem" }}
      />
      <button onClick={handleClick} style={{ marginTop: "0.5rem" }}>
        Send Question
      </button>
    </div>
  );
}

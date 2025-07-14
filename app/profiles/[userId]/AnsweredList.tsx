"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import getBaseUrl from "../../../lib/getBaseUrl";

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #333;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

interface AnsweredListProps {
  answered: any[];
  user: any;
  isOwner: boolean;
  loading: boolean;
  onDelete: () => void;
}

export default function AnsweredList({
  answered,
  user,
  isOwner,
  loading,
  onDelete,
}: AnsweredListProps) {
  const baseUrl = getBaseUrl();

  const canDelete = (q: any) =>
    q?.authorId === user?.googleId || isOwner || user?.status === "admin";

  const handleDelete = async (questionId: string) => {
    const res = await fetch(`${baseUrl}/personal/${questionId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.googleId }),
    });

    if (res.ok) {
      alert("✅ Question deleted!");
      onDelete();
    } else {
      const error = await res.text();
      alert(`Failed to delete question: ${res.status}\n${error}`);
    }
  };

  return (
    <>
      <h2>Answered Questions</h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <Spinner />
          <p style={{ color: "#666", fontStyle: "italic" }}>
            Loading answered questions...
          </p>
        </div>
      ) : answered.length === 0 ? (
        <p>No answered questions</p>
      ) : (
        answered.map((q) =>
          q?.title ? (
            <div
              key={q._id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <p>
                <strong>{q.title}</strong>
              </p>
              <p style={{ fontSize: "0.9em", color: "#666" }}>
                by {q.authorName}
              </p>

              {q.answer && (
                <div
                  style={{
                    marginTop: "1rem",
                    paddingLeft: "1rem",
                    borderLeft: "3px solid #333",
                  }}
                >
                  <p>💬 {q.answer}</p>
                  <p style={{ fontSize: "0.8em", color: "#999" }}>
                    — {user?.name || "Anonymous"}
                  </p>
                </div>
              )}

              {canDelete(q) && (
                <button onClick={() => handleDelete(q._id)}>
                  Delete Question
                </button>
              )}
            </div>
          ) : null
        )
      )}
    </>
  );
}

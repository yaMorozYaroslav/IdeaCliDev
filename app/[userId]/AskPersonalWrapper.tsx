"use client";

import styled from "styled-components";

export default function AskPersonalWrapper({
  profileUserId,
  currentUserId,
  isOwner,
}: {
  profileUserId: string;
  currentUserId: string | null;
  isOwner: boolean;
}) {
  if (isOwner) return null;

  return (
    <AskContainer>
      <AskButton
        onClick={() => {
          const title = prompt("What's your question?");
          if (!title) return;

          fetch("http://localhost:5000/personal/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              recipientUserId: profileUserId,
              userId: currentUserId, // may be null → backend handles it as anonymous
            }),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to ask");
              alert("Question sent!");
            })
            .catch((err) => {
              alert("❌ " + err.message);
            });
        }}
      >
        Ask a Question
      </AskButton>
    </AskContainer>
  );
}

const AskContainer = styled.div`
  text-align: center;
  margin: 1rem 0;
`;

const AskButton = styled.button`
  background-color: #0070f3;
  color: white;
  font-weight: bold;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: #0055aa;
  }
`;

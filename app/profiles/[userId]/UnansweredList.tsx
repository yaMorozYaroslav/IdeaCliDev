"use client";

import getBaseUrl from "../../../lib/getBaseUrl";
import {
  SectionWrapper,
  SectionTitle,
  Card,
  Title,
  ByLine,
  EmptyState,
  PrimaryButton,
} from "./section.styled";

interface UnansweredListProps {
  unanswered: any[];
  user: any;
  isOwner: boolean;
  onDelete: () => void;
  onAnswered: () => void;
}

export default function UnansweredList({
  unanswered,
  user,
  isOwner,
  onDelete,
  onAnswered,
}: UnansweredListProps) {
  if (!isOwner) return null;

  const baseUrl = getBaseUrl();

  const canDelete = (q: any) =>
    q?.authorId === user?.googleId || isOwner || user?.status === "admin";

  const handleAnswer = async (questionId: string) => {
    const content = prompt("Your answer:");
    if (!content) return;

    const res = await fetch(`${baseUrl}/personal/answer/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId: user?.googleId }),
    });

    if (res.ok) {
      alert("✅ Answer saved!");
      onAnswered();
    } else {
      let err;
      try {
        err = await res.json();
      } catch {
        err = { message: await res.text() };
      }
      alert(`❌ Failed to answer: ${err.message}`);
    }
  };

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
    <SectionWrapper>
      <SectionTitle>Unanswered Questions</SectionTitle>

      {unanswered.length === 0 && <EmptyState>No unanswered questions</EmptyState>}

      {unanswered.map((q) =>
        q?.title ? (
          <Card
            key={q._id}
            style={{ ["--indent-left" as any]: "3.5rem" }}
          >
            <Title>{q.title}</Title>
            <ByLine>by {q.authorName}</ByLine>

            <PrimaryButton onClick={() => handleAnswer(q._id)} aria-label="Answer question">
              Answer
            </PrimaryButton>
            {canDelete(q) && (
              <PrimaryButton
                data-danger="true"
                onClick={() => handleDelete(q._id)}
                aria-label="Delete question"
              >
                Delete Question
              </PrimaryButton>
            )}
          </Card>
        ) : null
      )}
    </SectionWrapper>
  );
}

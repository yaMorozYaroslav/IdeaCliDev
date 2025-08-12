"use client";

import getBaseUrl from "../../../lib/getBaseUrl";
import {
  SectionWrapper,
  SectionTitle,
  Card,
  Title,
  Meta,
  AnswerBlock,
  AnswerAuthor,
  Spinner,
  LoadingWrap,
  EmptyState,
  PrimaryButton,
} from "./section.styled";

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
    <SectionWrapper>
      <SectionTitle>Answered Questions</SectionTitle>

      {loading ? (
        <LoadingWrap>
          <Spinner />
          <p style={{ color: "#666", fontStyle: "italic" }}>
            Loading answered questions...
          </p>
        </LoadingWrap>
      ) : answered.length === 0 ? (
        <EmptyState>No answered questions</EmptyState>
      ) : (
        answered.map((q) =>
          q?.title ? (
            <Card
              key={q._id}
              style={{ ["--indent-left" as any]: "3.5rem" }}
            >
              <Title>{q.title}</Title>
              <Meta>by {q.authorName}</Meta>

              {q.answer && (
                <AnswerBlock
                  style={{ ["--answer-indent" as any]: "1.5rem" }}
                >
                  <p>💬 {q.answer}</p>
                  <AnswerAuthor>— {user?.name || "Anonymous"}</AnswerAuthor>
                </AnswerBlock>
              )}

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
        )
      )}
    </SectionWrapper>
  );
}

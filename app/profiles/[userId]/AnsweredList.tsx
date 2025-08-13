"use client";

import { useEffect, useMemo, useState } from "react";
import getBaseUrl from "../../../lib/getBaseUrl";
import {
  SectionWrapper,
  SectionTitle,
  Card,
  Title,
  TitleGroup,
  ByLine,
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
  onDelete: () => void; // still called after confirmed delete (e.g., to update counters)
}

export default function AnsweredList({
  answered,
  user,
  isOwner,
  loading,
  onDelete,
}: AnsweredListProps) {
  const baseUrl = getBaseUrl();

  // Local mirror so we can remove items after confirmed delete
  const [items, setItems] = useState<any[]>(answered || []);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setItems(answered || []);
  }, [answered]);

  const userId = user?.googleId ?? null;
  const isAdmin = user?.status === "admin";

  const canDelete = (q: any) =>
    q?.authorId === userId || isOwner || isAdmin;

  const handleDelete = async (questionId: string) => {
    if (!questionId || deletingIds.has(questionId)) return;

    setDeletingIds((prev) => new Set(prev).add(questionId));

    try {
      const res = await fetch(`${baseUrl}/personal/${questionId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      if (res.ok || res.status === 404) {
        // Confirmed by server (or already gone) -> remove from UI now
        setItems((prev) => prev.filter((q) => q._id !== questionId));
        // Let parent update counts/badges if needed
        try {
          onDelete?.();
        } catch {}
      } else {
        const errorText = await res.text().catch(() => "");
        console.warn("Failed to delete question:", res.status, errorText);
      }
    } catch (err) {
      console.warn("Delete error:", err);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
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
      ) : (items?.length ?? 0) === 0 ? (
        <EmptyState>No answered questions</EmptyState>
      ) : (
        items.map((q) =>
          q?.title ? (
            <Card key={q._id} style={{ ["--indent-left" as any]: "3.5rem" }}>
              <TitleGroup>
                <Title as="div">{q.title}</Title>
                <ByLine as="div">by {q.authorName}</ByLine>
              </TitleGroup>

              {q.answer && (
                <AnswerBlock style={{ ["--answer-indent" as any]: "1.5rem" }}>
                  <p>💬 {q.answer}</p>
                  <AnswerAuthor>— {user?.name || "Anonymous"}</AnswerAuthor>
                </AnswerBlock>
              )}

              {canDelete(q) && (
                <div style={{ marginTop: "0.75rem" }}>
                  <PrimaryButton
                    data-danger="true"
                    onClick={() => handleDelete(q._id)}
                    aria-label="Delete question"
                    disabled={deletingIds.has(q._id)}
                    title={deletingIds.has(q._id) ? "Deleting…" : "Delete question"}
                  >
                    {deletingIds.has(q._id) ? "Deleting…" : "Delete Question"}
                  </PrimaryButton>
                </div>
              )}
            </Card>
          ) : null
        )
      )}
    </SectionWrapper>
  );
}

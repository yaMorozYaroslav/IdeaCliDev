"use client";

import { useState, useEffect, useMemo } from "react";
import * as S from "./quest-detail.styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import getBaseUrl from "../../lib/getBaseUrl";

const QuestionDetail = ({
  question,
  userId,        // googleId or similar (preferred)
  userStatus,     // "admin" enables deletion
  userName,       // for posting new answers
  userIP,         // optional IP for anonymous fallback
  onNewAnswer,    // callback after posting
}) => {
  const [newAnswer, setNewAnswer] = useState("");
  const [posting, setPosting] = useState(false);
  const [answers, setAnswers] = useState(question.answers || []);

  // Build a fully-formed anonymous id once, if needed
  const [anonId, setAnonId] = useState(() => {
    if (!userIP) return "";
    return userIP.startsWith("Anonymous_") ? userIP : `Anonymous_${userIP}`;
  });

  // Only fetch IP if we have no logged-in id and no anonId yet
  useEffect(() => {
    if (!userId && !anonId) {
      fetch("https://api64.ipify.org?format=json")
        .then((r) => r.json())
        .then((d) => setAnonId(`Anonymous_${d.ip}`))
        .catch(() => setAnonId("Anonymous_unknown"));
    }
  }, [userId, anonId]);

  // Single source of truth for identity
  const effectiveUserId = useMemo(
    () => userId || anonId || "Anonymous_unknown",
    [userId, anonId]
  );
  const isAdmin = (userStatus || "").toString().trim().toLowerCase() === "admin";
  const canDelete = (authorId) => String(authorId || "") === String(effectiveUserId) || isAdmin;

  const baseUrl = getBaseUrl();

  const handleDelete = async (answerId, questionId) => {
    try {
      const res = await fetch(`${baseUrl}/questions/${questionId}/answers/${answerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": effectiveUserId,       // harmless if backend ignores
          "x-user-status": isAdmin ? "admin" : "",
        },
        body: JSON.stringify({ userId: effectiveUserId }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.message || "Failed to delete answer");
      setAnswers((prev) => prev.filter((a) => a._id !== answerId));
    } catch (error) {
      console.error("❌ Error deleting answer:", error.message);
    }
  };

  const handleLikeAnswer = async (answerId) => {
    try {
      const res = await fetch(
        `${baseUrl}/questions/${question._id}/answers/${answerId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": effectiveUserId,
          },
          body: JSON.stringify({ userId: effectiveUserId }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to like answer");

      setAnswers((prev) =>
        prev.map((a) =>
          a._id === answerId
            ? {
                ...a,
                likes: data.likes,
                likedBy: data.likedBy,
                anonymousLikes: data.anonymousLikes,
              }
            : a
        )
      );
    } catch (error) {
      console.error("❌ Error liking answer:", error.message);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    const content = newAnswer.trim();
    if (!content) return;

    setPosting(true);
    try {
      const res = await fetch(`${baseUrl}/questions/${question._id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          userId: effectiveUserId,
          name: userName || "Anonymous",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit answer");

      const created = await res.json();
      setAnswers((prev) => [...prev, created]);
      setNewAnswer("");
      onNewAnswer?.(created);
    } catch (error) {
      console.error("Error submitting answer:", error.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <S.Container>
      <S.QuestionTitle>{question.title}</S.QuestionTitle>
      {question.content && <S.QuestionContent>{question.content}</S.QuestionContent>}

      <S.AnswersContainer>
        <S.AnswerList>
          {answers.map((answer) => (
            <S.AnswerItem key={answer._id}>
              <S.AnswerContent>{answer.content}</S.AnswerContent>
              <S.AuthorName>by {answer.authorName || "Anonymous"}</S.AuthorName>
              <S.ActionButtons>
                <S.LikeButton onClick={() => handleLikeAnswer(answer._id)}>
                  <FontAwesomeIcon icon={faHeart} /> {answer.likes || 0}
                </S.LikeButton>
                {canDelete(answer.authorId) && (
                  <S.DeleteButton
                    title={isAdmin ? "Admin: delete answer" : "Delete your answer"}
                    onClick={() => handleDelete(answer._id, question._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </S.DeleteButton>
                )}
              </S.ActionButtons>
            </S.AnswerItem>
          ))}
        </S.AnswerList>
      </S.AnswersContainer>

      <S.AnswerForm onSubmit={handleSubmitAnswer}>
        <S.AnswerInput
          type="text"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer..."
        />
        <S.SubmitButton type="submit" disabled={posting}>
          {posting ? "Posting..." : "Submit Answer"}
        </S.SubmitButton>
      </S.AnswerForm>
    </S.Container>
  );
};

export default QuestionDetail;

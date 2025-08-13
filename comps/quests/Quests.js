"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import * as S from "./quests.styled";
import QuestionList from "./QuestList";
import { fetchAllQuestions, createQuestion } from "../../lib/questionsApi";

export default function Questions({ user }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 🔑 use rehydrated cookie user (not just SSR `user`)
  const [currentUser, setCurrentUser] = useState(user ?? null);

  useEffect(() => {
    if (!currentUser) {
      try {
        const raw = Cookies.get("user_data");
        if (raw) setCurrentUser(JSON.parse(raw));
      } catch {}
    }
    const onTokenRefreshed = () => {
      try {
        const raw = Cookies.get("user_data");
        if (raw) setCurrentUser(JSON.parse(raw));
      } catch {}
    };
    window.addEventListener("tokenRefreshed", onTokenRefreshed);
    return () => window.removeEventListener("tokenRefreshed", onTokenRefreshed);
  }, [currentUser]);

  // load on mount with abort safety
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      setError("");
      try {
        const list = await fetchAllQuestions(ctrl.signal);
        setQuestions(list);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Failed to load questions.");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  const handleQuestionSubmit = useCallback(async (title) => {
    const trimmed = (title || "").trim();
    if (!trimmed) return;

    const uid = currentUser?.googleId || currentUser?.userId || null;
    const name = currentUser?.name || "Anonymous";

    const ctrl = new AbortController();
    setSubmitting(true);
    setError("");
    try {
      const created = await createQuestion({ title: trimmed, userId: uid, name }, ctrl.signal);
      setQuestions((prev) => [created, ...prev]);
      setNewQuestion("");
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message || "Failed to submit question.");
    } finally {
      setSubmitting(false);
    }
  }, [currentUser?.googleId, currentUser?.userId, currentUser?.name]);

  return (
    <S.Container>
      <S.Title>What would you like to ask?</S.Title>

      <S.Form onSubmit={(e) => { e.preventDefault(); if (newQuestion.trim()) handleQuestionSubmit(newQuestion); }}>
        <S.QuestionInput
          type="text"
          placeholder="Type your question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          disabled={submitting}
        />
        <S.SubmitButton type="submit" disabled={submitting || !newQuestion.trim()}>
          {submitting ? "Submitting…" : "Submit"}
        </S.SubmitButton>
      </S.Form>

      {error && <div style={{ color: "#cc0000", margin: "0.5rem 0" }}>{error}</div>}

      {loading ? (
        <S.DotLoaderContainer><S.BouncingDot /></S.DotLoaderContainer>
      ) : (
        <QuestionList
          questions={questions}
          setQuestions={setQuestions}
          userId={currentUser?.googleId || currentUser?.userId || null}
          userStatus={currentUser?.status || null}
          userName={currentUser?.name || undefined}
        />
      )}
    </S.Container>
  );
}

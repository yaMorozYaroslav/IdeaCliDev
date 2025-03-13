"use client";

import { useState } from "react";
import * as S from "./quest-form.styled"; // Import styles

export default function QuestionForm({ onQuestionSubmit }) {
  const [newQuestion, setNewQuestion] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    await onQuestionSubmit(newQuestion);
    setNewQuestion(""); // Reset input field
  }

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.Input
        type="text"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        placeholder="Type your question..."
      />
      <S.Button type="submit">Submit</S.Button>
    </S.Form>
  );
}

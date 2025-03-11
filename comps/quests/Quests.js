"use client";

import { useState, useEffect } from "react";
import QuestionForm from "./QuestForm";
import QuestionList from "./QuestList";
import * as S from "./quests.styled"; // Import styles

export default function Questions() {
  const BASE_URL = "http://localhost:5000/questions";
  const [questions, setQuestions] = useState([]);

  // Fetch questions from API (on mount)
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(BASE_URL);
        const data = await res.json();
        setQuestions(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  }, []);

  // Handle new question submission
  const handleQuestionSubmit = async (questionData) => {
    console.log("Submitting question:", questionData); // Debugging log

    try {
        const response = await fetch("http://localhost:5000/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(questionData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to submit question");
        }

        const newQuestion = await response.json();
        console.log("Question submitted successfully:", newQuestion);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

  // Handle answering a question
const handleAnswerSubmit = async (e) => {
  e.preventDefault();
  if (!newAnswer.trim()) return;

  setPosting(true);

  try {
    console.log("Submitting answer to:", `http://localhost:5000/questions/${questionId}/answers`);
    console.log("Request Body:", { content: newAnswer, userId });

    const response = await fetch(`http://localhost:5000/questions/${questionId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newAnswer, userId }),
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Response:", errorData);
      throw new Error(errorData.message || "Failed to submit answer");
    }

    const updatedQuestion = await response.json();
    setQuestion(updatedQuestion);
    setNewAnswer("");
  } catch (error) {
    console.error("Error submitting answer:", error);
  } finally {
    setPosting(false);
  }
};



  // Handle liking an answer
 async function handleLike(questionId, answerId, setLoading) {
  setLoading(true);

  try {
    const res = await fetch(`http://localhost:5000/questions/${questionId}/answers/${answerId}/like`, {
      method: "POST",
    });

    const updatedQuestion = await res.json(); // Get the updated question data

    console.log("Updated Question After Like:", updatedQuestion); // Debugging log

    if (res.ok) {
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? updatedQuestion : q)) // Update UI with new likes
      );
    } else {
      console.error("Error:", updatedQuestion.message);
    }
  } catch (error) {
    console.error("Error liking answer:", error);
  } finally {
    setLoading(false);
  }
}


  return (
    <S.Container>
      <h2>Ask a Question</h2>
      <QuestionForm onQuestionSubmit={handleQuestionSubmit} />
      <QuestionList questions={questions} onAnswerSubmit={handleAnswerSubmit} onLike={handleLike} />
    </S.Container>
  );
}

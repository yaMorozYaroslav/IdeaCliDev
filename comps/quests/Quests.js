import { useState, useEffect } from "react";
import * as S from "./quests.styled"; // Import styles
import QuestionList from "./QuestList";
import getBaseUrl from "../../lib/getBaseUrl"; // ✅ fixed import path

export default function Questions({ user }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL = `${getBaseUrl()}/questions`; // ✅ correct dynamic backend base

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();

      // 🕒 Simulate loading delay
      setTimeout(() => {
        setQuestions(data.reverse()); // Newest first
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (questionTitle) => {
    if (typeof questionTitle !== "string" || !questionTitle.trim()) {
      console.error("Error: questionTitle is invalid:", questionTitle);
      return;
    }

    const questionData = {
      title: questionTitle.trim(),
      userId: user?.userId || null,
      name: user?.name || "Anonymous",
    };

    console.log("Submitting question:", JSON.stringify(questionData));

    try {
      const response = await fetch(`${BASE_URL}/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Response:", errorText);
        throw new Error(errorText || "Failed to submit question");
      }

      const newQuestionData = await response.json();
      setQuestions((prev) => [newQuestionData, ...prev]);
      setNewQuestion("");
    } catch (error) {
      console.error("Error submitting question:", error.message);
    }
  };

  return (
    <S.Container>
      <S.Title>What would you like to ask?</S.Title>

      <S.Form
        onSubmit={(e) => {
          e.preventDefault();
          if (newQuestion.trim()) {
            handleQuestionSubmit(newQuestion.trim());
          } else {
            console.error("Error: Question cannot be empty.");
          }
        }}
      >
        <S.QuestionInput
          type="text"
          placeholder="Type your question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <S.SubmitButton type="submit">Submit</S.SubmitButton>
      </S.Form>

      {loading ? (
        <S.DotLoaderContainer>
          <S.BouncingDot />
        </S.DotLoaderContainer>
      ) : (
        <QuestionList
  questions={questions}
  setQuestions={setQuestions}
  userId={user?.userId || cookieUser?.userId}
  userStatus={user?.status || cookieUser?.status}
  userName={user?.name || cookieUser?.name}
/>
      )}
    </S.Container>
  );
}

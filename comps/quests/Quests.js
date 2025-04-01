import { useState, useEffect } from "react";
import * as S from "./quests.styled"; // Import styles
import QuestionList from "./QuestList";

export default function Questions({ user }) {
  const BASE_URL = "https://idea-sphere-50bb3c5bc07b.herokuapp.com/questions";
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();

      // 🕒 Simulate longer loading (1.5 seconds total)
      setTimeout(() => {
        setQuestions(data.reverse()); // Ensure newest questions appear first
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false); // Stop loading on error
    }
  };

  const handleQuestionSubmit = async (questionTitle) => {
  if (typeof questionTitle !== "string" || !questionTitle.trim()) {
    console.error("Error: questionTitle is invalid:", questionTitle);
    return;
  }

  const userIdentifier = user?.userId || null;
  const userName = user?.name || "Anonymous"; // 👈 Add this line

  const questionData = {
    title: questionTitle.trim(),
    userId: userIdentifier,
    name: userName, // 👈 Add name to request body
  };

  console.log("Submitting question:", JSON.stringify(questionData), user);

  try {
    const response = await fetch(`${BASE_URL}/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
          key={questions.length}
          questions={questions}
          setQuestions={setQuestions}
          userId={user?.userId}
          userStatus={user?.status}
        />
      )}
    </S.Container>
  );
}

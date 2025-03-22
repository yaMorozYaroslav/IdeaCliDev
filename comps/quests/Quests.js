import { useState, useEffect } from "react";
import * as S from "./quests.styled"; // Import styles
import QuestionList from "./QuestList";

export default function Questions({user}) {
  const BASE_URL = "https://idea-sphere-50bb3c5bc07b.herokuapp.com/questions";
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState(""); // ✅ Track question input

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setQuestions(data.reverse()); // Ensure newest questions appear first
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleQuestionSubmit = async (questionTitle) => {
  if (typeof questionTitle !== "string" || !questionTitle.trim()) {
    console.error("Error: questionTitle is invalid:", questionTitle);
    return;
  }

  // ✅ Create full payload with title and userId
  const userIdentifier = user?.userId || null; // assuming user is passed via props
  const questionData = {
    title: questionTitle.trim(),
    userId: userIdentifier,
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
      <S.Title>Ask a Question</S.Title>

      {/* ✅ Prevent form refresh by using an inline function */}
      <form onSubmit={(e) => {
        e.preventDefault(); // ✅ Stop page reload
        if (newQuestion.trim()) {
          handleQuestionSubmit(newQuestion.trim());
        } else {
          console.error("Error: Question cannot be empty.");
        }
      }}>
        <S.QuestionInput
          type="text"
          placeholder="Type your question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <S.SubmitButton type="submit">Submit</S.SubmitButton>
      </form>

      <QuestionList  key={questions.length} 
                     questions={questions} 
                     setQuestions={setQuestions} 
                     userId={user?.userId}  // ✅ Pass userId
                     userStatus={user?.status}  // ✅ Pass userStatus
                                                                     />
  
     </S.Container>
  );
}

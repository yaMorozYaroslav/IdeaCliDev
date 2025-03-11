import { useState, useEffect } from "react";
import * as S from "./quest-list.styled"; // Import styles
import QuestionDetail from "./QuestDetail";

const QuestionList = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:5000/questions");
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestions(data.reverse()); // Reverse order to show newest first
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionDetail = async (questionId) => {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null);
      setQuestionDetails(null);
      return;
    }

    setExpandedQuestionId(questionId);
    setDetailsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/questions/${questionId}`);
      if (!response.ok) throw new Error("Failed to fetch question details");
      const data = await response.json();
      setQuestionDetails(data);
    } catch (error) {
      console.error("Error fetching question details:", error);
      setExpandedQuestionId(null);
      setQuestionDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleLikeQuestion = async (questionId) => {
    try {
        const requestBody = userId ? { userId } : {}; // Send userId if available

        const response = await fetch(`http://localhost:5000/questions/${questionId}/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to like question");
        }

        const updatedQuestion = await response.json();

        // Update state
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) => (q._id === questionId ? updatedQuestion : q))
        );

        if (expandedQuestionId === questionId) {
            setQuestionDetails(updatedQuestion);
        }
    } catch (error) {
        console.error("Error liking question:", error.message);
    }
};

 const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!newAnswer.trim()) {
        console.error("Error: Answer cannot be empty");
        return;
    }

    setPosting(true);

    // ✅ Ensure the body is correct JSON
    const requestBody = {
        content: newAnswer.trim(),
        userId: userId || null, // Use null if userId is undefined
    };

    console.log("Submitting answer:", JSON.stringify(requestBody)); // Debugging log

    try {
        const response = await fetch(`http://localhost:5000/questions/${question._id}/answers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Ensure JSON format
                "Accept": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Response error:", errorText);
            throw new Error("Failed to submit answer: " + errorText);
        }

        const updatedQuestion = await response.json();
        setNewAnswer("");
        onNewAnswer(updatedQuestion);
    } catch (error) {
        console.error("Error submitting answer:", error.message);
    } finally {
        setPosting(false);
    }
};


  return (
    <S.Container>
      <S.Title>Questions</S.Title>
      {questions.map((question) => (
        <S.QuestionItem key={question._id}>
          <S.QuestionHeader>
            <S.QuestionTitle onClick={() => toggleQuestionDetail(question._id)}>
              {question.title}
              <S.AnswerCount title={`Show ${question.answers?.length || 0} answers`}>
                ({question.answers?.length || 0} answers)
              </S.AnswerCount>
            </S.QuestionTitle>
            <S.ActionButtons>
              <S.LikeButton onClick={() => handleLikeQuestion(question._id)}>
                👍 {question.likes?.length || 0}
              </S.LikeButton>
              {question.author === userId && (
                <S.DeleteButton onClick={() => handleDeleteQuestion(question._id)}>🗑️</S.DeleteButton>
              )}
            </S.ActionButtons>
          </S.QuestionHeader>

          {expandedQuestionId === question._id && (
            <S.DetailWrapper>
              {detailsLoading ? (
                <S.LoadingMessage>Loading question details...</S.LoadingMessage>
              ) : (
                questionDetails && <QuestionDetail question={questionDetails} userId={userId} onNewAnswer={handleNewAnswer} />
              )}
            </S.DetailWrapper>
          )}
        </S.QuestionItem>
      ))}
    </S.Container>
  );
};

export default QuestionList;

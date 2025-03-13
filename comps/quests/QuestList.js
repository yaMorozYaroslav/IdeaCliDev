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

        // ✅ Ensure smooth scrolling without jumping under sticky header
        setTimeout(() => {
            document.getElementById(`question-${questionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
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
      const requestBody = userId ? { userId } : {};
      const response = await fetch(`http://localhost:5000/questions/${questionId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to like question");
      }

      await fetchQuestions(); // Force refresh from backend to ensure updated likes
    } catch (error) {
      console.error("Error liking question:", error.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${questionId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete question");
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId));
      if (expandedQuestionId === questionId) {
        setExpandedQuestionId(null);
        setQuestionDetails(null);
      }
    } catch (error) {
      console.error("Error deleting question:", error.message);
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
                  👍 {(question.likes?.length || 0) + (question.anonymousLikes?.length || 0)}
              </S.LikeButton>

              {question.author === userId && (
                <S.DeleteButton onClick={() => handleDeleteQuestion(question._id)}>🗑️</S.DeleteButton>
              )}
            </S.ActionButtons>
          </S.QuestionHeader>

          {expandedQuestionId === question._id && questionDetails && (
            <S.DetailWrapper isVisible={expandedQuestionId === question._id}>
  {detailsLoading ? (
    <S.LoadingMessage>Loading question details...</S.LoadingMessage>
  ) : (
    questionDetails && <QuestionDetail question={questionDetails} userId={userId} onNewAnswer={fetchQuestions} />
  )}
</S.DetailWrapper>

          )}
        </S.QuestionItem>
      ))}
    </S.Container>
  );
};

export default QuestionList;

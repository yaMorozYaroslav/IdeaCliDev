import { useState, useEffect } from "react";
import * as S from "./quest-list.styled";
import QuestionDetail from "./QuestDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";

const QuestionList = ({ userId, userStatus }) => {
    const [questions, setQuestions] = useState([]);
    const [expandedQuestionId, setExpandedQuestionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [questionDetails, setQuestionDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [localUserId, setLocalUserId] = useState(userId);

  console.log(questions)
    useEffect(() => {
        fetchQuestions();
    }, []);
  useEffect(() => {
  const fetchIpIfAnonymous = async () => {
    if (!userId) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setLocalUserId(`Anonymous_${data.ip}`);
      } catch (err) {
        console.error("❌ Failed to fetch IP for anonymous user:", err);
        setLocalUserId("Anonymous_unknown");
      }
    }
  };
  fetchIpIfAnonymous();
}, [userId]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch("https://idea-sphere-50bb3c5bc07b.herokuapp.com/questions");
            if (!response.ok) throw new Error("Failed to fetch questions");
            const data = await response.json();
            setQuestions(data.reverse()); // Show newest first
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
            const response = await fetch(`https://idea-sphere-50bb3c5bc07b.herokuapp.com/questions/${questionId}`);
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

   const handleDeleteQuestion = async (questionId) => {
  // Dynamically fetch user IP if no userId
  const getLocalUserIP = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch (err) {
      console.error("❌ Failed to fetch IP:", err);
      return "unknown";
    }
  };

  // Get the correct user identifier
  const ip = userId ? null : await getLocalUserIP();
  const userIdentifier = userId || `Anonymous_${ip}`;
  const url = `https://idea-sphere-50bb3c5bc07b.herokuapp.com/questions/${questionId}`;

  try {
    console.log(`🗑️ Deleting question: ${questionId}`);
    console.log("👤 User Identifier:", userIdentifier);
    console.log("📡 DELETE Request to:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userIdentifier }),
    });

    const result = await response.json();
    console.log("🔁 Server response:", result);

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete question");
    }

    setQuestions((prev) => prev.filter((q) => String(q._id) !== String(questionId)));
    console.log("✅ Question deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting question:", error.message);
  }
};



    const handleLikeQuestion = async (questionId) => {
        try {
            const response = await fetch(`https://idea-sphere-50bb3c5bc07b.herokuapp.com/questions/${questionId}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            console.log("Server response (like):", data);

            if (!response.ok) throw new Error(data.message || "Failed to like question");

            setQuestions(prevQuestions => prevQuestions.map(q => 
                q._id === questionId ? { ...q, likes: data.likes } : q
            ));
        } catch (error) {
            console.error("❌ Error liking question:", error.message);
        }
    };

    return (
  <S.Container>
    <S.Title>Questions</S.Title>
    {questions.map((question) => (
      <S.QuestionItem key={question._id}>
        <S.QuestionHeader>
          <div>
            <S.QuestionTitle onClick={() => toggleQuestionDetail(question._id)}>
              {question.title}
              <S.AnswerCount title={`Show ${question.answers?.length || 0} answers`}>
                ({question.answers?.length || 0} answers)
              </S.AnswerCount>
            </S.QuestionTitle>
            <S.AuthorName>
              Asked by: {question.authorName || "Anonymous"}
            </S.AuthorName>
          </div>

          <S.ActionButtons>
            <S.LikeButton onClick={() => handleLikeQuestion(question._id)}>
              <FontAwesomeIcon icon={faHeart} /> {question.likes || 0}
            </S.LikeButton>

            {(question.authorId === localUserId || userStatus === "admin") && (
              <S.DeleteButton onClick={() => handleDeleteQuestion(question._id)}>
                <FontAwesomeIcon icon={faTrash} />
              </S.DeleteButton>
            )}
          </S.ActionButtons>
        </S.QuestionHeader>

        {expandedQuestionId === question._id && questionDetails && (
          <S.DetailWrapper isVisible={expandedQuestionId === question._id}>
            {detailsLoading ? (
              <S.LoadingMessage>Loading question details...</S.LoadingMessage>
            ) : (
              <QuestionDetail 
                question={questionDetails} 
                userId={localUserId} 
                userStatus={userStatus} 
                onNewAnswer={fetchQuestions} 
              />
            )}
          </S.DetailWrapper>
        )}
      </S.QuestionItem>
    ))}
  </S.Container>
);
}

export default QuestionList;

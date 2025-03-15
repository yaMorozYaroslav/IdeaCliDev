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
  console.log(questions)
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch("http://localhost:5000/questions");
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

    const handleDeleteQuestion = async (questionId) => {
    try {
        console.log(`🔍 Attempting to delete question: ${questionId}`);
        console.log("Headers Sent:", {
            "x-user-id": userId,
            "x-user-status": userStatus
        });

        const response = await fetch(`http://localhost:5000/questions/${questionId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": userId || "",
                "x-user-status": userStatus || ""
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        console.log("🔍 Server response:", data);

        if (!response.ok) throw new Error(data.message || "Failed to delete question");

        setQuestions(prevQuestions => prevQuestions.filter(q => String(q._id) !== String(questionId)));
        console.log("✅ Question deleted successfully");

    } catch (error) {
        console.error("❌ Error deleting question:", error.message);
    }
};


    const handleLikeQuestion = async (questionId) => {
        try {
            const response = await fetch(`http://localhost:5000/questions/${questionId}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId
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
                        <S.QuestionTitle onClick={() => toggleQuestionDetail(question._id)}>
                            {question.title}
                            <S.AnswerCount title={`Show ${question.answers?.length || 0} answers`}>
                                ({question.answers?.length || 0} answers)
                            </S.AnswerCount>
                        </S.QuestionTitle>
                        <S.ActionButtons>
                            <S.LikeButton onClick={() => handleLikeQuestion(question._id)}>
                                <FontAwesomeIcon icon={faHeart} /> {question.likes || 0}
                            </S.LikeButton>
                            {(question.author === userId || userStatus === "admin") && (
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
                                questionDetails && <QuestionDetail 
                                    question={questionDetails} 
                                    userId={userId} 
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
};

export default QuestionList;

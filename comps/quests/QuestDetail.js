import { useState, useEffect } from "react";
import * as S from "./quest-detail.styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";

const QuestionDetail = ({ question, userId, userStatus, onNewAnswer }) => {
    const [newAnswer, setNewAnswer] = useState("");
    const [posting, setPosting] = useState(false);
    const [answers, setAnswers] = useState(question.answers || []);
    
    useEffect(() => {
        console.log("Current User ID:", userId);
        console.log("Current User Status:", userStatus);
    }, [userId, userStatus]);
    
    const canDelete = (authorId) => {
        return userStatus === "admin" || authorId === userId;
    };

    const handleDelete = async (type, itemId, parentId = null) => {
        try {
            const url = type === "question" 
                ? `http://localhost:5000/questions/${itemId}` 
                : `http://localhost:5000/questions/${parentId}/answers/${itemId}`;
            
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                    "x-user-status": userStatus
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) throw new Error(`Failed to delete ${type}`);

            if (type === "question") {
                console.log("✅ Question deleted successfully");
            } else {
                setAnswers((prevAnswers) => prevAnswers.filter((a) => a._id !== itemId));
                console.log("✅ Answer deleted successfully");
            }
        } catch (error) {
            console.error(`❌ Error deleting ${type}:`, error.message);
        }
    };

    const handleLikeAnswer = async (answerId) => {
        try {
            console.log("Liking answer:", answerId);
            
            const response = await fetch(`http://localhost:5000/questions/${question._id}/answers/${answerId}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            console.log("Server response (like):", data);

            if (!response.ok) throw new Error(data.message || "Failed to like answer");

            setAnswers(prevAnswers => prevAnswers.map(a => 
                a._id === answerId ? { 
                    ...a, 
                    likes: data.likes, 
                    likedBy: data.likedBy,
                    anonymousLikes: data.anonymousLikes
                } : a
            ));
        } catch (error) {
            console.error("❌ Error liking answer:", error.message);
        }
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        if (!newAnswer.trim()) return;

        setPosting(true);
        try {
            const response = await fetch(`http://localhost:5000/questions/${question._id}/answers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newAnswer.trim(), userId }),
            });

            if (!response.ok) throw new Error("Failed to submit answer");

            const updatedAnswer = await response.json();
            setAnswers((prevAnswers) => [...prevAnswers, updatedAnswer]);
            setNewAnswer("");
            onNewAnswer(updatedAnswer);
        } catch (error) {
            console.error("Error submitting answer:", error.message);
        } finally {
            setPosting(false);
        }
    };

    return (
        <S.Container>
            <S.QuestionTitle>{question.title}</S.QuestionTitle>
            <S.QuestionContent>{question.content}</S.QuestionContent>
            {canDelete(question.authorId) && (
                <S.DeleteButton onClick={() => handleDelete("question", question._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                </S.DeleteButton>
            )}

            <S.AnswersContainer>
                <S.AnswerList>
                    {answers.map((answer) => (
                        <S.AnswerItem key={answer._id}>
                            <S.AnswerContent>{answer.content}</S.AnswerContent>
                            <S.ActionButtons>
                                <S.LikeButton onClick={() => handleLikeAnswer(answer._id)}>
                                    <FontAwesomeIcon icon={faHeart} /> 
                                    {(answer.likes || 0)} 
                                </S.LikeButton>
                                {canDelete(answer.authorId) && (
                                    <S.DeleteButton onClick={() => handleDelete("answer", answer._id, question._id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </S.DeleteButton>
                                )}
                            </S.ActionButtons>
                        </S.AnswerItem>
                    ))}
                </S.AnswerList>
            </S.AnswersContainer>

            <S.AnswerForm onSubmit={handleSubmitAnswer}>
                <S.AnswerInput
                    type="text"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Write your answer..."
                />
                <S.SubmitButton type="submit" disabled={posting}>
                    {posting ? "Posting..." : "Submit Answer"}
                </S.SubmitButton>
            </S.AnswerForm>
        </S.Container>
    );
};

export default QuestionDetail;

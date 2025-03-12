import { useState } from "react";
import * as S from "./quest-detail.styled";

const QuestionDetail = ({ question, userId, onNewAnswer }) => {
    const [newAnswer, setNewAnswer] = useState("");
    const [posting, setPosting] = useState(false);
    const [answers, setAnswers] = useState(question.answers || []);

    const handleDeleteAnswer = async (answerId) => {
        try {
            const response = await fetch(`http://localhost:5000/answers/${answerId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete answer");

            setAnswers((prevAnswers) => prevAnswers.filter((a) => a._id !== answerId));
        } catch (error) {
            console.error("Error deleting answer:", error.message);
        }
    };

    const handleLikeAnswer = async (answerId) => {
        try {
            const requestBody = userId ? { userId } : {};
            
            const response = await fetch(`http://localhost:5000/answers/${answerId}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to like answer");
            }

            const updatedAnswer = await response.json();
            setAnswers((prevAnswers) => prevAnswers.map((a) => (a._id === answerId ? updatedAnswer : a)));
        } catch (error) {
            console.error("Error liking answer:", error.message);
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

            const updatedQuestion = await response.json();
            setAnswers(updatedQuestion.answers);
            setNewAnswer("");
            onNewAnswer(updatedQuestion);
        } catch (error) {
            console.error("Error submitting answer:", error.message);
        } finally {
            setPosting(false);
        }
    };
console.log("Received question details:", question);

    return (
        <S.Container>
            <S.QuestionTitle>{question.title}</S.QuestionTitle>
            <S.QuestionContent>{question.content}</S.QuestionContent>

            <S.AnswersContainer>
                {answers.map((answer) => (
                    <S.AnswerItem key={answer._id}>
                        <S.AnswerContent>{answer.content}</S.AnswerContent>
                        <S.ActionButtons>
                            <S.LikeButton onClick={() => handleLikeAnswer(answer._id)}>
                                👍 {answer.likes?.length || 0}
                            </S.LikeButton>
                            {answer.author === userId && (
                                <S.DeleteButton onClick={() => handleDeleteAnswer(answer._id)}>🗑️</S.DeleteButton>
                            )}
                        </S.ActionButtons>
                    </S.AnswerItem>
                ))}
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

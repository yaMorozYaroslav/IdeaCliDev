import { useState, useEffect } from "react";
import * as S from "./quest-detail.styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";

const QuestionDetail = ({ question, userId, userStatus, userIP, onNewAnswer, user }) => {
  const [newAnswer, setNewAnswer] = useState("");
  const [posting, setPosting] = useState(false);
  const [answers, setAnswers] = useState(question.answers || []);
  const [localUserIP, setLocalUserIP] = useState(userIP || "");

  // ✅ Fetch user IP if not already provided
  useEffect(() => {
    if (!userIP) {
      fetch("https://api64.ipify.org?format=json")
        .then(response => response.json())
        .then(data => setLocalUserIP(`Anonymous_${data.ip}`))
        .catch(error => console.error("Failed to get user IP:", error));
    }
  }, [userIP]);

  const canDelete = (authorId) =>
    authorId === userId || userStatus === "admin";

  const handleDelete = async (answerId, questionId) => {
    const userIdentifier = userId || `Anonymous_${localUserIP}`;
    const url = `https://idea-sphere-50bb3c5bc07b.herokuapp.com/questions/${questionId}/answers/${answerId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userIdentifier }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete answer");

      setAnswers((prev) => prev.filter((a) => a._id !== answerId));
    } catch (error) {
      console.error("❌ Error deleting answer:", error.message);
    }
  };

  const handleLikeAnswer = async (answerId) => {
    try {
      const response = await fetch(
        `https://idea-sphere-50bb3c5bc07b.herokuapp.com/questions/${question._id}/answers/${answerId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId || localUserIP,
          },
          body: JSON.stringify({ userId: userId || localUserIP }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to like answer");

      setAnswers(prevAnswers =>
        prevAnswers.map(a =>
          a._id === answerId
            ? {
                ...a,
                likes: data.likes,
                likedBy: data.likedBy,
                anonymousLikes: data.anonymousLikes,
              }
            : a
        )
      );
    } catch (error) {
      console.error("❌ Error liking answer:", error.message);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setPosting(true);
    try {
      const response = await fetch(
        `https://idea-sphere-50bb3c5bc07b.herokuapp.com/questions/${question._id}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: newAnswer.trim(),
            userId: userId || localUserIP,
            name: user?.name || "Anonymous", // ✅ Include author name
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit answer");

      const updatedAnswer = await response.json();
      setAnswers(prev => [...prev, updatedAnswer]);
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

      <S.AnswersContainer>
        <S.AnswerList>
          {answers.map((answer) => (
            <S.AnswerItem key={answer._id}>
              <S.AnswerContent>{answer.content}</S.AnswerContent>
              <S.AuthorName>by {answer.authorName || "Anonymous"}</S.AuthorName>
              <S.ActionButtons>
                <S.LikeButton onClick={() => handleLikeAnswer(answer._id)}>
                  <FontAwesomeIcon icon={faHeart} /> {(answer.likes || 0)}
                </S.LikeButton>
                {canDelete(answer.authorId) && (
                  <S.DeleteButton onClick={() => handleDelete(answer._id, question._id)}>
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

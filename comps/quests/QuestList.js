import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as S from "./quest-list.styled";
import QuestionDetail from "./QuestDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import getBaseUrl from "../../lib/getBaseUrl";

export default function QuestionList({
  questions,
  setQuestions,
  userId,
  userStatus,
  userName,
}) {
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [questionDetails, setQuestionDetails] = useState(null);

  // Derive identity/admin from props OR cookie (cookie wins if valid)
  const [cookieUserId, setCookieUserId] = useState(null);
  const [cookieStatus, setCookieStatus] = useState(null);

  useEffect(() => {
    try {
      const raw = Cookies.get("user_data");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCookieUserId(parsed?.userId || parsed?.googleId || null);
        setCookieStatus(parsed?.status || null);
      }
    } catch (e) {
      console.warn("Failed to parse user_data cookie:", e);
    }
  }, []);

  const effectiveUserId = cookieUserId || userId || null;
  const effectiveStatus = (cookieStatus || userStatus || "").toString().trim().toLowerCase();
  const isAdmin = effectiveStatus === "admin";

  // Local user id for actions/like/delete; fallback to IP only if no user at all
  const [localUserId, setLocalUserId] = useState(effectiveUserId);

  useEffect(() => {
    setLocalUserId(effectiveUserId);
  }, [effectiveUserId]);

  useEffect(() => {
    const fetchIpIfAnonymous = async () => {
      if (!effectiveUserId) {
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          const data = await res.json();
          setLocalUserId(`Anonymous_${data.ip}`);
        } catch {
          setLocalUserId("Anonymous_unknown");
        }
      }
    };
    fetchIpIfAnonymous();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once; we already react to effectiveUserId via the effect above

  const baseUrl = getBaseUrl();

  const toggleQuestionDetail = async (questionId) => {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null);
      setQuestionDetails(null);
      return;
    }
    setExpandedQuestionId(questionId);
    setDetailsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/questions/${questionId}`);
      if (!res.ok) throw new Error("Failed to fetch question details");
      const data = await res.json();
      setQuestionDetails(data);
    } catch {
      setExpandedQuestionId(null);
      setQuestionDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleLikeQuestion = async (questionId) => {
    try {
      const res = await fetch(`${baseUrl}/questions/${questionId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: localUserId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to like question");
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q, likes: data.likes } : q))
      );
    } catch (e) {
      console.error("❌ Error liking question:", e.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const res = await fetch(`${baseUrl}/questions/${questionId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: localUserId || "Anonymous_unknown" }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to delete question");
      setQuestions((prev) => prev.filter((q) => String(q._id) !== String(questionId)));
    } catch (e) {
      console.error("❌ Error deleting question:", e.message);
    }
  };

  // Debug once to confirm admin + ids
  useEffect(() => {
    if (questions?.length) {
      console.log({
        fromProps_userStatus: userStatus,
        fromCookie_status: cookieStatus,
        effectiveStatus,
        isAdmin,
        localUserId,
        firstQuestionAuthorId: questions[0]?.authorId,
      });
    }
  }, [questions, userStatus, cookieStatus, effectiveStatus, isAdmin, localUserId]);

  return (
    <S.Container>
      <S.Title>Questions</S.Title>

      {questions.map((question) => {
        const authoredByUser =
          String(question.authorId ?? "") === String(localUserId ?? "");
        const canDelete = isAdmin || authoredByUser;

        return (
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

                {canDelete && (
                  <S.DeleteButton
                    title={isAdmin ? "Admin: delete question" : "Delete your question"}
                    onClick={() => handleDeleteQuestion(question._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </S.DeleteButton>
                )}
              </S.ActionButtons>
            </S.QuestionHeader>

            {expandedQuestionId === question._id && (
              <S.DetailWrapper isVisible>
                {detailsLoading ? (
                  <S.LoadingMessage>Loading question details...</S.LoadingMessage>
                ) : (
                  questionDetails && (
                    <QuestionDetail
                      question={questionDetails}
                      userId={localUserId}
                      userStatus={effectiveStatus}
                      onNewAnswer={() => {}}
                      userName={userName || undefined}
                    />
                  )
                )}
              </S.DetailWrapper>
            )}
          </S.QuestionItem>
        );
      })}
    </S.Container>
  );
}

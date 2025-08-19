import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import * as S from "./quest-list.styled";
import QuestionDetail from "./QuestDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import getBaseUrl from "@/lib/getBaseUrl";

function readUserFromCookie() {
  try {
    const raw = Cookies.get("user_data");
    if (!raw) return { userId: null, name: null, status: null };
    const u = JSON.parse(raw);
    return {
      userId: u.googleId || u.userId || null,
      name: u.name || u.displayName || null,
      status: u.status || u.role || null,
    };
  } catch {
    return { userId: null, name: null, status: null };
  }
}

export default function QuestList({
  questions = [],
  setQuestions,
  userId: propUserId,
  userStatus: propUserStatus,
  userName: propUserName,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [questionDetails, setQuestionDetails] = useState(null);

  const [cookieUser, setCookieUser] = useState(readUserFromCookie());

  useEffect(() => {
    const onUserUpdate = () => setCookieUser(readUserFromCookie());
    window.addEventListener("userDataUpdated", onUserUpdate);
    window.addEventListener("tokenRefreshed", onUserUpdate);
    return () => {
      window.removeEventListener("userDataUpdated", onUserUpdate);
      window.removeEventListener("tokenRefreshed", onUserUpdate);
    };
  }, []);

  const effective = useMemo(() => {
    return {
      userId: cookieUser.userId ?? propUserId ?? null,
      status: cookieUser.status ?? propUserStatus ?? null,
      name: cookieUser.name ?? propUserName ?? null,
    };
  }, [cookieUser, propUserId, propUserStatus, propUserName]);

  const isAdmin = effective.status === "admin";

  const likeCountOf = (q) => {
    if (typeof q.likes === "number") return q.likes;
    const arr1 = Array.isArray(q.likes) ? q.likes.length : 0; // legacy
    const arr2 = Array.isArray(q.likedBy) ? q.likedBy.length : 0;
    const arr3 = Array.isArray(q.anonymousLikes) ? q.anonymousLikes.length : 0;
    return arr1 || arr2 + arr3;
  };

  const toggleExpand = (qid) => {
    setExpandedId((prev) => (prev === qid ? null : qid));
    // if you want lazy details, set loading & fetch here then setQuestionDetails
  };

  // Optional helper if you create questions from here:
  const createQuestion = async (title) => {
    if (!title || !title.trim()) return;
    const payload = {
      title: title.trim(),
      userId: effective.userId ?? undefined,
      name: effective.name ?? undefined,
    };
    const res = await fetch(`${getBaseUrl()}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.warn("Create failed", await res.text());
      return null;
    }
    const created = await res.json();
    setQuestions?.((prev) => [created, ...(prev || [])]);
    return created;
  };

  const handleLike = async (qid) => {
    const payload = { userId: effective.userId ?? undefined };
    try {
      const res = await fetch(`${getBaseUrl()}/questions/${qid}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        console.warn("Like failed", data || (await res.text()));
        return;
      }
      // Server returns { _id, likes, likedBy, anonymousLikes }
      setQuestions?.((prev) =>
        (prev || []).map((q) =>
          q._id === qid
            ? { ...q, likes: data.likes, likedBy: data.likedBy, anonymousLikes: data.anonymousLikes }
            : q
        )
      );
    } catch (e) {
      console.warn("Like error", e);
    }
  };

  const handleDelete = async (qid) => {
    // Frontend gate: allow if admin or author
    const authoredByUser = (questions || []).some(
      (q) => q._id === qid && String(q.authorId ?? "") === String(effective.userId ?? "")
    );
    if (!isAdmin && !authoredByUser) return;

    const payload = { userId: effective.userId ?? undefined };
    try {
      const res = await fetch(`${getBaseUrl()}/questions/${qid}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload), // your backend reads userId from body for DELETE
      });
      if (res.ok) {
        setQuestions?.((prev) => (prev || []).filter((q) => q._id !== qid));
      } else {
        console.warn("Delete failed", await res.text());
      }
    } catch (e) {
      console.warn("Delete error", e);
    }
  };

  if (!Array.isArray(questions)) return null;

  return (
    <S.Container>
      {questions.map((q) => {
        const authoredByUser =
          String(q.authorId ?? "") === String(effective.userId ?? "");
        const canDelete = isAdmin || authoredByUser;

        return (
          <S.QuestionItem key={q._id}>
            <S.QuestionHeader>
              <div style={{ minWidth: 0 }}>
                <S.QuestionTitle onClick={() => toggleExpand(q._id)}>
                  {q.title || q.content || "Question"}
                </S.QuestionTitle>
                {typeof q.answerCount === "number" && (
                  <S.AnswerCount>({q.answerCount})</S.AnswerCount>
                )}
                {q.authorName && <S.AuthorName>by {q.authorName}</S.AuthorName>}
              </div>

              <S.ActionButtons>
                <S.LikeButton aria-label="like" onClick={() => handleLike(q._id)}>
                  <FontAwesomeIcon icon={faHeart} />
                  <span>{likeCountOf(q)}</span>
                </S.LikeButton>

                {canDelete && (
                  <S.DeleteButton
                    aria-label="delete"
                    onClick={() => handleDelete(q._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </S.DeleteButton>
                )}
              </S.ActionButtons>
            </S.QuestionHeader>

            <S.DetailWrapper isVisible={expandedId === q._id}>
              {detailsLoading ? (
                <S.LoadingMessage>Loading…</S.LoadingMessage>
              ) : (
                expandedId === q._id && (
                  <QuestionDetail
                    question={questionDetails || q}
                    loading={detailsLoading}
                    onClose={() => setExpandedId(null)}
                  />
                )
              )}
            </S.DetailWrapper>
          </S.QuestionItem>
        );
      })}
    </S.Container>
  );
}

import styled from "styled-components";

const Card = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ByLine = styled.p`
  font-size: 0.9em;
  color: #666;
`;

const Button = styled.button`
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  cursor: pointer;
  background: #0052cc;
  color: white;
  border: none;
  border-radius: 4px;

  &:hover {
    background: #0066ff;
  }
`;

interface UnansweredListProps {
  unanswered: any[];
  user: any;
  isOwner: boolean;
  onDelete: () => void;
  onAnswered: () => void;
}

export default function UnansweredList({
  unanswered,
  user,
  isOwner,
  onDelete,
  onAnswered,
}: UnansweredListProps) {
  if (!isOwner) return null;

  const canDelete = (q: any) =>
    q?.authorId === user?.googleId || isOwner || user?.status === "admin";

  const handleAnswer = async (questionId: string) => {
    const content = prompt("Your answer:");
    if (!content) return;

    const res = await fetch(`/personal/answer/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId: user?.googleId }),
    });

    if (res.ok) {
      onAnswered();
    } else {
      const err = await res.json();
      alert(`❌ Failed to answer: ${err.message}`);
    }
  };

  const handleDelete = async (questionId: string) => {
    const res = await fetch(`/personal/${questionId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.googleId }),
    });

    if (res.ok) {
      onDelete();
    } else {
      const error = await res.text();
      alert(`Failed to delete question: ${res.status}\n${error}`);
    }
  };

  return (
    <>
      <h2>Unanswered Questions</h2>
      {unanswered.length === 0 && <p>No unanswered questions</p>}
      {unanswered.map((q) =>
        q?.title ? (
          <Card key={q._id}>
            <p><strong>{q.title}</strong></p>
            <ByLine>by {q.authorName}</ByLine>

            <Button onClick={() => handleAnswer(q._id)}>Answer</Button>
            {canDelete(q) && (
              <Button onClick={() => handleDelete(q._id)}>Delete Question</Button>
            )}
          </Card>
        ) : null
      )}
    </>
  );
}

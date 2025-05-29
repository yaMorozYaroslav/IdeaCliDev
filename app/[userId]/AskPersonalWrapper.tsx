import AskPersonalButton from "./AskPersonalButton";

interface AskPersonalWrapperProps {
  profileUserId: string;
  currentUserId: string | null;
  isOwner: boolean;
}

export default function AskPersonalWrapper({
  profileUserId,
  currentUserId,
  isOwner,
}: AskPersonalWrapperProps) {
  if (isOwner || !profileUserId || profileUserId === currentUserId) return null;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <AskPersonalButton recipientUserId={profileUserId} />
    </div>
  );
}

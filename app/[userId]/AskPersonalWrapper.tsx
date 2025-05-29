import AskPersonalButton from "./AskPersonalButton";

interface AskPersonalWrapperProps {
  recipientUserId: string;
}

export default function AskPersonalWrapper({ recipientUserId }: AskPersonalWrapperProps) {
  if (!recipientUserId) return null;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <AskPersonalButton recipientUserId={recipientUserId} />
    </div>
  );
}

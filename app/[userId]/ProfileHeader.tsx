interface ProfileHeaderProps {
  user: {
    name: string;
    picture?: string;
  };
  isOwner: boolean;
}

export default function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  return (
    <div
      style={{
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name}
          style={{ width: 48, height: 48, borderRadius: "50%" }}
        />
      )}
      <strong>{user.name}</strong>
      {isOwner && (
        <span style={{ fontSize: "0.8rem", color: "#888" }}>(You)</span>
      )}
    </div>
  );
}

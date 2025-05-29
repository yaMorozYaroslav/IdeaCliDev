interface ProfileHeaderProps {
  user: {
    name: string;
    picture?: string;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name}
          style={{ width: 48, height: 48, borderRadius: "50%" }}
        />
      )}
      <strong>{user.name}</strong>
    </div>
  );
}

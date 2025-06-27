"use client";

import styled from "styled-components";

export default function ProfileHeader({
  user,
  isOwner,
}: {
  user: any;
  isOwner: boolean;
}) {
  console.log("👤 ProfileHeader user:", user);

  const name = user?.name?.trim() || "Anonymous";
  const picture = user?.picture?.trim() || "/default-avatar.png";
  const unansweredCount = isOwner ? user?.unanswered ?? 0 : null;

  return (
    <HeaderContainer>
      <Avatar src={picture} alt={name} />
      <Name>
        {name}
        {isOwner && unansweredCount !== null && (
          <UnansweredBadge>{unansweredCount}</UnansweredBadge>
        )}
      </Name>
      {isOwner && <Note>This is your profile</Note>}
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.h2`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const UnansweredBadge = styled.span`
  background-color: #e74c3c;
  color: white;
  font-size: 0.9rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
`;

const Note = styled.p`
  color: #666;
  font-style: italic;
`;

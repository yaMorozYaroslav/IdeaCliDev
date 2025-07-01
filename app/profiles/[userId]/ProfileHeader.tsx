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

  return (
    <HeaderContainer>
      <Avatar src={picture} alt={name} />
      <Name>{name}</Name>
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

const Note = styled.p`
  color: #666;
  font-style: italic;
`;

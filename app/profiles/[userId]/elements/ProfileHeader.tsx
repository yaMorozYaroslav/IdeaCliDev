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
  /* remove top gap, keep some bottom breathing room */
  padding: 0 1rem 1.25rem;
  margin: 0; /* ensure no accidental top margin */
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto; /* center without adding vertical gap */
`;

const Name = styled.h2`
  margin: 0.5rem 0 0; /* tighter than 1rem, no extra top gap */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const Note = styled.p`
  color: #666;
  font-style: italic;
  margin: 0.5rem 0 0; /* avoid default top margin bumps */
`;

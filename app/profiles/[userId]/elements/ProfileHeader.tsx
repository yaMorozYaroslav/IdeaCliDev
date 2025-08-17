// app/profiles/[userId]/elements/ProfileHeader.tsx
"use client";

import React from "react";
import styled from "styled-components";
import type { ProfileUser } from "@/lib/profiles/profile-client";

type ProfileHeaderProps = {
  user: ProfileUser | null;
  isOwner: boolean;
};

export default function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  if (!user) return null;

  return (
    <HeaderWrap>
      <Avatar
        src={user.picture ?? "/avatar.svg"}
        alt={user.name ?? "User"}
        width={56}
        height={56}
      />
      <Info>
        <Name>{user.name ?? "Użytkownik"}</Name>
        {isOwner && <Badge>Twój profil</Badge>}
      </Info>
    </HeaderWrap>
  );
}

const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: 1.05rem;
  line-height: 1.2;
`;

const Badge = styled.div`
  font-size: 0.8rem;
  opacity: 0.75;
`;

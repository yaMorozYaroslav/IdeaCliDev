// app/profiles/[userId]/ClientUserProfile.tsx
"use client";

import styled from "styled-components";
import AskPersonalWrapper from "./prof-comps/AskPersonalWrapper";
import ProfileHeader from       "./prof-comps/ProfileHeader";
import UnansweredList from     "./prof-comps/UnansweredList";
import AnsweredList from       "./prof-comps/AnsweredList";

import { useProfileData } from "@/lib/profiles/useProfileData";
import type { ProfileUser } from "@/lib/profiles/profile-client"; // adjust path if needed

type ClientUserProfileProps = {
  userId: string;
  user?: ProfileUser | null;
  initialUnanswered?: unknown[];
};

export default function ClientUserProfile({
  userId: profileUserId,
  user,
  initialUnanswered = [],
}: ClientUserProfileProps) {
  const {
    hydratedUser,
    answered,
    unanswered,
    isOwner,
    currentUserId,
    triggerRefresh,
  } = useProfileData({ profileUserId, user, initialUnanswered });

  return (
    <ContentWrapper>
      <ProfileHeader user={hydratedUser} isOwner={isOwner} />

      {!isOwner && (
        <AskPersonalWrapper
          profileUserId={profileUserId}
          currentUserId={currentUserId}
          isOwner={false}
        />
      )}

      {isOwner && (
        <UnansweredList
          unanswered={unanswered}
          user={hydratedUser}
          isOwner
          onDelete={triggerRefresh}
          onAnswered={triggerRefresh}
        />
      )}

      <AnsweredList
        answered={answered}
        user={hydratedUser}
        isOwner={isOwner}
        loading={false}
        onDelete={triggerRefresh}
      />
    </ContentWrapper>
  );
}

const ContentWrapper = styled.div`
  margin-top: 30px;
  @media (max-width: 768px) {
    margin-top: 0px;
  }
`;

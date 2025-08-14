"use client";

import styled from "styled-components";
import AskPersonalWrapper from "./AskPersonalWrapper";
import ProfileHeader from "./ProfileHeader";
import UnansweredList from "./UnansweredList";
import AnsweredList from "./AnsweredList";
import { useProfileData } from "@/lib/profiles/useProfileData";

export default function ClientUserProfile({
  userId: profileUserId,
  user,
  initialUnanswered = [],
}) {
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
          isOwner={true}
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
  padding-top: 0;
  @media (max-width: 768px) {
    margin-top: 0px;
  }
`;

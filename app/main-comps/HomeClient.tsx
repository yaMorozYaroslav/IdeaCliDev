"use client";

import styled from "styled-components";
import Questions from "./quests/Quests.js";
import type { ProfileUser } from "@/lib/profiles/profile-client";

type HomeClientProps = {
  user?: ProfileUser | null;
};

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top:-90px;

  min-height: 60vh;
  background-color: black;
  overflow-x: hidden;

  @media (max-width: 768px) {
    margin-top: -120px;
  }
`;

const WelcomeMessage = styled.h1<{ $first?: boolean }>`
  margin-top: ${(props) => (props.$first ? "120px" : "0")};
  font-size: 32px;
  color: white;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 24px;
  }

  @media (max-width: 400px) {
    margin-top: ${(props) => (props.$first ? "120px" : "4px")};
  }

  @media (max-width: 300px) {
    font-size: 20px;
  }
`;

export default function HomeClient({ user }: HomeClientProps) {
  return (
    <Container>
      <WelcomeMessage $first>Ask &amp; Answer Questions</WelcomeMessage>
      <WelcomeMessage>Anonymously &amp; Personally</WelcomeMessage>

      <Questions user={user} />
    </Container>
  );
}

"use client";

import React from "react";
import styled from "styled-components";
import Questions from "/comps/quests/Quests";

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
  min-height: 60vh;
  background-color: black;

  @media (max-width: 750px) {
    padding-top: 133px;
  }

  @media (max-width: 480px) {
    margin-left: -10px;
    width: 107%;
  }
`;

const WelcomeMessage = styled.h1`
  margin-top: ${(props) => (props.$first ? "15px" : "-20px")};
  font-size: 32px;
  color: white;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export default function HomeClient({ user }) {
  return (
    <Container>
      <WelcomeMessage $first={true}>Ask & Answer Questions</WelcomeMessage>
      <br />
      <WelcomeMessage $first={false}>Anonymously & Personally</WelcomeMessage>

      <Questions user={user} />

      <pre style={{ color: "white", marginTop: "40px" }}>
        {user ? JSON.stringify(user, null, 2) : "❌ No user loaded from token."}
      </pre>
    </Container>
  );
}

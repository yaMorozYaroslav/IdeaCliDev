"use client";

import React from "react";
import styled from "styled-components";
import Questions from "./quests/Quests.js";

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start; /* start right under header */
  align-items: center;

  /* Removed local padding-top so layout controls the offset */
  padding-top: 0;

  min-height: 60vh;
  background-color: black;
  overflow-x: hidden;
`;

const WelcomeMessage = styled.h1<{ $first?: boolean }>`
  margin-top: ${(props) => (props.$first ? "20px" : "-10px")};
  font-size: 32px;
  color: white;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 24px;
  }

  @media (max-width: 400px) {
    margin-top: ${(props) => (props.$first ? "0" : "3px")};
  }

  @media (max-width: 300px) {
    font-size: 20px;
  }
`;

export default function HomeClient({ user }) {
  return (
    <Container>
      <WelcomeMessage $first>Ask & Answer Questions</WelcomeMessage>
      <WelcomeMessage>Anonymously & Personally</WelcomeMessage>

      <Questions user={user} />

      <pre style={{ color: "white", marginTop: "40px" }}>
        {user ? JSON.stringify(user, null, 2) : "❌ No user loaded from token."}
      </pre>
    </Container>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Questions from "/comps/quests/Quests";

const Container = styled.div`
  display: flex;
  width:100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 100px;  // ✅ Add space for sticky header
  min-height: 60vh;
  background-color: black;
@media (max-width: 750px) {
    padding-top:133px;
  }

@media (max-width: 480px) {
    margin-left:-10px;
    width:107%;
  }
`;


const WelcomeMessage = styled.h1`
  font-size: 30px;
  margin:4px;
  color: white;
@media (max-width: 750px) {
    
  }

@media (max-width: 480px) {
    font-size: 24px;
  }
`;

export default function HomeClient() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find((row) => row.startsWith("user_data="));
    if (userCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
        setUser(parsed);
      } catch (e) {
        console.error("❌ Failed to parse user_data cookie:", e);
      }
    }
  }, []);

  return (
    <Container>

        <WelcomeMessage>Ask & Answer Questions</WelcomeMessage><br/>
        <WelcomeMessage>Anonymously & Personally</WelcomeMessage>     

      <Questions user={user} /> {/* ✅ Pass user to Questions */}
    </Container>
  );
}

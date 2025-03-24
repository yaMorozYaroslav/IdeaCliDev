"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Questions from "/comps/quests/Quests";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 100px;  // ✅ Add space for sticky header
  min-height: 60vh;
  background-color: #f9fafb;
`;


const WelcomeMessage = styled.h1`
  font-size: 2rem;
  color: #1e293b;
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
      {user ? (
        <WelcomeMessage>Welcome back, {user.name}!</WelcomeMessage>
      ) : (
        <WelcomeMessage>Welcome to Idea Sphere. Please log in.</WelcomeMessage>
      )}
      <Questions user={user} /> {/* ✅ Pass user to Questions */}
    </Container>
  );
}

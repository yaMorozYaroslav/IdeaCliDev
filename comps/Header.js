"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Image from "next/image";
import { FiMenu } from "react-icons/fi"; // Import menu icon from react-icons

// Styled Header Container (Fixed Position)
const HeaderContainer = styled.header.attrs(() => ({}))`
  width: 100vw;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  background-color: #1e293b;
  color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  height: 80px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ $isVisible }) => ($isVisible ? "translateY(0)" : "translateY(-100%)")};
  z-index: 1000;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px 20px;
    height: 70px;
  }
`;

// Menu Button (Left Side)
const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

// Logo Section (Centered)
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-grow: 1; /* Pushes everything else to the right */
  justify-content: center;
`;

// Logo Image
const LogoImage = styled(Image)`
  width: 50px;
  height: 50px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

// User Section (Right Aligned)
const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// User Avatar (Using Next.js Image for Optimization)
const UserAvatar = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;

// User Name (Small & Close to Logout Button)
const UserName = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #e2e8f0;
  white-space: nowrap;
`;

// Logout Button (Closer to User Info)
const AuthButton = styled.button`
  padding: 8px 14px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
  transition: background 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;

  &:hover {
    background-color: #2563eb;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.85rem;
    height: 32px;
  }
`;

export default function Header({ user, refreshUser }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:5000/google/oauth/callback&response_type=code&scope=openid%20email%20profile`;
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/google/logout",
        {},
        { withCredentials: true }
      );
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <HeaderContainer $isVisible={isVisible}>
      {/* Menu Button (Left Side) */}
      <MenuButton>
        <FiMenu />
      </MenuButton>

      {/* Logo Section (Centered) */}
      <LogoContainer>
        <LogoImage src="/IconIdea.png" alt="Idea Sphere Logo" width={50} height={50} />
        <h1>Idea Sphere</h1>
      </LogoContainer>

      {/* User Section (User Info + Logout Button) */}
      {user ? (
        <UserSection>
          <UserAvatar src={user.picture} alt={user.name} width={35} height={35} />
          <UserName>{user.name}</UserName>
          <AuthButton onClick={handleLogout}>Logout</AuthButton>
        </UserSection>
      ) : (
        <AuthButton onClick={handleLogin}>Login with Google</AuthButton>
      )}
    </HeaderContainer>
  );
}

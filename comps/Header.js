"use client";

import React, { useState, useEffect } from "react";

import { FiMenu } from "react-icons/fi";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import * as S from "./header.styled";


const API_URL = "https://idea-sphere-50bb3c5bc07b.herokuapp.com";

export default function Header({ user }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user || null);

  useEffect(() => {
    if (!currentUser) {
      const cookies = document.cookie.split("; ");
      const userCookie = cookies.find((row) => row.startsWith("user_data="));
      if (userCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
          setCurrentUser(userData);
        } catch (e) {
          console.error("❌ Failed to parse user_data cookie:", e);
          setCurrentUser(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);

      if (window.scrollY <= lastScrollY) return;
      setMenuOpen(false); // Close menu on scroll down

    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${API_URL}/google/oauth/callback&response_type=code&scope=openid%20email%20profile`;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setCurrentUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <>
      <S.HeaderContainer $isVisible={isVisible}>
        <S.FlexWrapper>
          {/* Logo */}
          <S.LogoContainer>
            <S.LogoImage src="/IconIdea.png" alt="Idea Sphere Logo" width={80} height={80} />
            <h1>Idea Sphere</h1>
          </S.LogoContainer>

          {/* User Info */}
          <S.UserContainer>
            {currentUser ? (
              <>
                {currentUser.picture && (
                  <S.UserAvatar src={currentUser.picture} alt={currentUser.name} width={40} height={40} />
                )}
                <S.UserName>{currentUser.name}</S.UserName>
              </>
            ) : (
              <S.UserName>Anonymous</S.UserName>
            )}

            <S.AuthButton onClick={currentUser ? handleLogout : handleLogin}>
              {currentUser ? "Logout" : "Login with Google"}
            </S.AuthButton>
          </S.UserContainer>

          {/* Menu Button */}
          <S.MenuButton
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <FiMenu />
          </S.MenuButton>
        </S.FlexWrapper>
      </S.HeaderContainer>

      {/* Floating dropdown below header */}
      {menuOpen && isVisible && (
        <S.MenuDropdownFixed>
          <S.MenuItem>
            <FaSearch /> Search
          </S.MenuItem>
          <S.MenuItem>
            <FaInfoCircle /> About Us
          </S.MenuItem>
        </S.MenuDropdownFixed>
      )}
    </>
  );
}

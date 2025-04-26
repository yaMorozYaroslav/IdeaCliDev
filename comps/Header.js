"use client";

import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import * as S from "./header.styled";
import getBaseUrl from "/lib/getBaseUrl";

export default function Header({ user }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user || null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loadUserFromCookie = () => {
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
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadUserFromCookie();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);

      if (window.scrollY <= lastScrollY) return;
      setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogin = () => {
  const baseUrl = getBaseUrl();
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${baseUrl}/google/oauth/callback&response_type=code&scope=openid%20email%20profile`;

  setIsLoggingIn(true); // Show loading state

  const popup = window.open(authUrl, "oauthPopup", "width=500,height=600");

  if (popup) {
    const handleMessage = (event) => {
      if (event.data?.loginDone) {
        console.log("✅ Received loginDone message - refreshing user info...");
        loadUserFromCookie();
        setIsLoggingIn(false);
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);
  } else {
    console.error("❌ Failed to open login popup");
    setIsLoggingIn(false);
  }
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

            <S.AuthButton onClick={currentUser ? handleLogout : handleLogin} disabled={isLoggingIn}>
              {currentUser
                ? "Logout"
                : isLoggingIn
                ? "Logging in..."
                : "Login with Google"}
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

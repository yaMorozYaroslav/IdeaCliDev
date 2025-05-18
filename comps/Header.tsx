"use client";

import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import * as S from "./header.styled";
import getBaseUrl from "../lib/getBaseUrl";

interface User {
  userId: string;
  name: string;
  picture?: string;
  unanswered?: any[];
  [key: string]: any;
}

interface HeaderProps {
  user?: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user ?? null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  const loadUserFromCookie = () => {
  const cookies = document.cookie.split("; ");
  const userCookie = cookies.find((row) => row.startsWith("user_data="));
  if (userCookie) {
    try {
      const encodedValue = userCookie.split("=")[1];
      const decodedValue = decodeURIComponent(encodedValue); // ✅ this decodes %7B%22user...
      const userData = JSON.parse(decodedValue);             // ✅ now safe to parse
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
  loadUserFromCookie(); // always try to load the latest user on mount

  const handleTokenRefreshed = () => loadUserFromCookie();
  window.addEventListener("tokenRefreshed", handleTokenRefreshed);
  return () => window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
}, []);
  useEffect(() => {
  const interval = setInterval(() => loadUserFromCookie(), 15000); // every 15s
  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);
      if (window.scrollY > lastScrollY) setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth(); // Set on mount
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleLogin = () => {
    const baseUrl = getBaseUrl();
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${baseUrl}/google/oauth/callback&response_type=code&scope=openid%20email%20profile`;

    setIsLoggingIn(true);
    const popup = window.open(authUrl, "oauthPopup", "width=500,height=600");

    if (popup) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.loginDone) {
          loadUserFromCookie();
          setIsLoggingIn(false);
          window.removeEventListener("message", handleMessage);
        }
      };
      window.addEventListener("message", handleMessage);
    } else {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
  try {
    await fetch("/api/logout", { method: "POST" });
    setCurrentUser(null);
    document.cookie = "user_data=; path=/; max-age=0"; // just in case
    window.dispatchEvent(new Event("tokenRefreshed")); // manually trigger UI update
  } catch (error) {
    console.error("❌ Logout failed:", error);
  }
};


  const authLabel =
    isLoggingIn
      ? "Logging in..."
      : screenWidth !== null && screenWidth <= 400
      ? "Login"
      : "Login with Google";

  return (
    <S.HeaderContainer $isVisible={isVisible}>
      <S.FlexWrapper>
        {/* Top row: logo + burger */}
        <S.TopRow>
          <S.LogoContainer>
            <S.LogoImage src="/IconIdea.png" alt="Idea Sphere Logo" />
            <h1>Idea Sphere</h1>
          </S.LogoContainer>

          {/* Mobile burger beside logo (only visible on small screens) */}
          <S.BurgerMobile>
            <S.MenuButton
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <FiMenu />
            </S.MenuButton>
          </S.BurgerMobile>
        </S.TopRow>

        {/* Bottom row: user info + auth */}
        <S.BottomRow>
          <S.UserContainer>
            {currentUser ? (
              <>
                {currentUser.picture && (
                  <S.UserAvatar src={currentUser.picture} alt={currentUser.name} />
                )}
                <S.UserNameLink href={`/${currentUser.userId}`}>
  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block", maxWidth: 120, verticalAlign: "middle" }}>
    {currentUser.name}
  </span>
</S.UserNameLink>
{Array.isArray(currentUser.unanswered) && (
  <span> ({currentUser.unanswered.length || "*"})</span>
)}

              </>
            ) : (
              <S.UserName>Anonymous</S.UserName>
            )}

            <S.AuthButton
              onClick={currentUser ? handleLogout : handleLogin}
              disabled={isLoggingIn}
              data-label={authLabel}
            >
              {authLabel}
            </S.AuthButton>
          </S.UserContainer>

          {/* Desktop burger */}
          <S.BurgerDesktop>
            <S.MenuButton
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <FiMenu />
            </S.MenuButton>
          </S.BurgerDesktop>
        </S.BottomRow>

        {/* Dropdown menu if open */}
        {menuOpen && (
          <S.MenuDropdownFixed>
            <S.MenuItem>
              <FaSearch /> Search
            </S.MenuItem>
            <S.MenuItem>
              <FaInfoCircle /> About Us
            </S.MenuItem>
          </S.MenuDropdownFixed>
        )}
      </S.FlexWrapper>
    </S.HeaderContainer>
  );
};

export default Header;

"use client";

import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import * as S from "./header.styled";
import getBaseUrl from "../lib/getBaseUrl";

interface User {
  userId: string;
  name: string;
  email?: string;
  picture?: string;
  status?: string;
  unansweredCount?: number;
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
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
    updateWidth();
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
          setIsLoggingIn(false);
          window.removeEventListener("message", handleMessage);
          window.location.reload(); // reload to refresh user prop
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
      window.dispatchEvent(new Event("tokenRefreshed"));
      window.location.reload(); // force refresh after logout
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  const authLabel = isLoggingIn
    ? "Logging in..."
    : currentUser
    ? "Logout"
    : screenWidth !== null && screenWidth <= 400
    ? "Login"
    : "Login with Google";

  return (
    <S.HeaderContainer $isVisible={isVisible}>
      <S.FlexWrapper>
        <S.TopRow>
          <S.LogoContainer>
            <S.LogoImage src="/IconIdea.png" alt="Idea Sphere Logo" />
            <h1>Idea Sphere</h1>
          </S.LogoContainer>

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

        <S.BottomRow>
          <S.UserContainer>
            {currentUser ? (
              <>
                {currentUser.picture && (
                  <S.UserAvatar src={currentUser.picture} alt={currentUser.name} />
                )}
                <S.UserNameLink
                  href={`/profiles/${currentUser.userId}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                      maxWidth: 120,
                      verticalAlign: "middle",
                    }}
                  >
                    {currentUser.name}
                  </span>
                  <span>({currentUser.unansweredCount || 0})</span>
                </S.UserNameLink>
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

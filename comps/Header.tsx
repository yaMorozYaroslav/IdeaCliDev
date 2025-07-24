"use client";

import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import Cookies from "js-cookie"; // ✅ NEW: To read user_data cookie
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

  // ✅ Listen for scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);
      if (window.scrollY > lastScrollY) setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // ✅ Track screen width for responsive behavior
  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // ✅ Listen for global user updates and refresh state from cookie
  useEffect(() => {
    const updateUserFromCookie = () => {
      try {
        const raw = Cookies.get("user_data");
        if (raw) {
          const parsed = JSON.parse(raw);
          setCurrentUser(parsed);
          console.log("🔁 Header updated from cookie:", parsed);
        }
      } catch (err) {
        console.warn("❌ Failed to parse user_data in header:", err);
      }
    };

    window.addEventListener("tokenRefreshed", updateUserFromCookie);
    return () => window.removeEventListener("tokenRefreshed", updateUserFromCookie);
  }, []);

  // ✅ Handle Google login popup
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
          window.location.reload(); // force rehydration
        }
      };
      window.addEventListener("message", handleMessage);
    } else {
      setIsLoggingIn(false);
    }
  };

  // ✅ Handle logout + force refresh
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setCurrentUser(null);
      window.dispatchEvent(new Event("tokenRefreshed"));
      window.location.reload(); // refresh to reset SSR props too
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  const authLabel =
  isLoggingIn
    ? "Logging in..."
    : !currentUser && screenWidth !== null && screenWidth <= 400
    ? "Login"
    : currentUser
    ? "Logout"
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

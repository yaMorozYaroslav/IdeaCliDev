"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import * as S from "./header.styled";
import getBaseUrl from "../lib/getBaseUrl";

interface User {
  userId?: string;
  googleId?: string;
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
  const headerRef = useRef<HTMLDivElement | null>(null);

  const parseCookieJSON = (val?: string | null) => {
    if (!val) return null;
    try {
      return JSON.parse(val);
    } catch {
      try {
        return JSON.parse(decodeURIComponent(val));
      } catch {
        return null;
      }
    }
  };

  // Scroll show/hide (and close menu when scrolling down)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(y <= lastScrollY);
          setLastScrollY(y);
          if (y > lastScrollY) setMenuOpen(false);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  // Track width
  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Hydrate user from cookie on first mount
  useEffect(() => {
    if (currentUser) return;
    const parsed = parseCookieJSON(Cookies.get("user_data"));
    if (parsed?.name) {
      setCurrentUser(parsed);
      console.log("✅ Header hydrated from cookie on mount:", parsed);
    }
  }, []); // once

  // Update user from cookie on token refresh
  useEffect(() => {
    const updateUserFromCookie = () => {
      const parsed = parseCookieJSON(Cookies.get("user_data"));
      if (parsed?.name) {
        setCurrentUser(parsed);
        console.log("🔁 Header updated from cookie (tokenRefreshed):", parsed);
      } else {
        setCurrentUser(null);
      }
    };
    window.addEventListener("tokenRefreshed", updateUserFromCookie);
    return () => window.removeEventListener("tokenRefreshed", updateUserFromCookie);
  }, []);

  // Live header gap: 0 when hidden, real height when visible
  useEffect(() => {
    const setGap = () => {
      const height = headerRef.current
        ? Math.round(headerRef.current.getBoundingClientRect().height)
        : 0;
      const gap = isVisible ? height : 0;
      // Use :root so it’s available everywhere
      document.documentElement.style.setProperty("--header-gap", `${gap}px`);
    };

    // Observe header size changes (fonts, images)
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window && headerRef.current) {
      ro = new ResizeObserver(setGap);
      ro.observe(headerRef.current);
    }

    setGap();
    const onResize = () => setGap();
    const onScroll = () => setGap();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (ro && headerRef.current) ro.unobserve(headerRef.current);
    };
  }, [isVisible]);

  // Google login popup
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
          window.location.reload();
        }
      };
      window.addEventListener("message", handleMessage);
    } else {
      setIsLoggingIn(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setCurrentUser(null);
      window.dispatchEvent(new Event("tokenRefreshed"));
      window.location.reload();
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

  const profileId = currentUser?.userId || currentUser?.googleId;

  return (
    <S.HeaderContainer
      ref={headerRef}
      $isVisible={isVisible}
      style={{
        // keep the original inline animation you used
        transform: isVisible ? "translateY(0%)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <S.FlexWrapper>
        <S.TopRow>
          <S.LogoContainer>
            <S.LogoImage src="/IconIdea.png" alt="Idea Sphere Logo" />
            <h1>Idea Sphere</h1>
          </S.LogoContainer>

          <S.BurgerMobile>
            <S.MenuButton
              onClick={() => setMenuOpen((v) => !v)}
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
                  href={profileId ? `/profiles/${profileId}` : "#"}
                  aria-label={`Open profile of ${currentUser.name}`}
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
                  <span>({currentUser.unansweredCount ?? 0})</span>
                </S.UserNameLink>
              </>
            ) : (
              <S.UserName>Anonymous</S.UserName>
            )}

            <S.AuthButton
              onClick={currentUser ? handleLogout : handleLogin}
              disabled={isLoggingIn}
              $authLabel={authLabel}
            >
              {authLabel}
            </S.AuthButton>
          </S.UserContainer>

          <S.BurgerDesktop>
            <S.MenuButton
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <FiMenu />
            </S.MenuButton>
          </S.BurgerDesktop>
        </S.BottomRow>

        {menuOpen && isVisible && (
          <S.MenuDropdownFixed role="menu" aria-label="Header menu">
            <S.MenuItem role="menuitem">
              <FaSearch /> Search
            </S.MenuItem>
            <S.MenuItem role="menuitem">
              <FaInfoCircle /> About Us
            </S.MenuItem>
          </S.MenuDropdownFixed>
        )}
      </S.FlexWrapper>
    </S.HeaderContainer>
  );
};

export default Header;

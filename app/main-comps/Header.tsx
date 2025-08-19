// comps/Header.tsx
"use client";

import React, { useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import * as S from "./header.styled";
import { User } from "@/lib/header/user-type";
import { useAuthUser, useAuthActions } from "@/lib/header/use-auth";
import { useHeaderVisibility } from "@/lib/header/use-visibility";
import { useScreenWidth } from "@/lib/header/use-width";
import { useHeaderGap } from "@/lib/header/use-gap";

type HeaderProps = { user?: User | null };

export default function Header({ user }: HeaderProps) {
  const { currentUser, isAuthed, setCurrentUser } = useAuthUser(user ?? null);
  const { isVisible } = useHeaderVisibility();
  const screenWidth = useScreenWidth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { login, logout, isLoggingIn } = useAuthActions(setCurrentUser);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useHeaderGap(headerRef, isVisible);

  const authLabel =
    isLoggingIn
      ? "Logging in..."
      : !isAuthed && screenWidth !== null && screenWidth <= 400
      ? "Login"
      : isAuthed
      ? "Logout"
      : "Login with Google";

  const profileId = currentUser?.userId || currentUser?.googleId;

  return (
    <S.HeaderContainer
      ref={headerRef}
      $isVisible={isVisible}
      style={{
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
            {isAuthed ? (
              <>
                {currentUser?.picture && (
                  <S.UserAvatar src={currentUser.picture} alt={currentUser.name ?? "User"} />
                )}
                <S.UserNameLink
                  href={profileId ? `/profiles/${profileId}` : "#"}
                  aria-label={`Open profile of ${currentUser?.name ?? "user"}`}
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
                    {currentUser?.name ?? "User"}
                  </span>
                  <span>({currentUser?.unansweredCount ?? 0})</span>
                </S.UserNameLink>
              </>
            ) : (
              <S.UserName>Anonymous</S.UserName>
            )}

            <S.AuthButton
              onClick={isAuthed ? logout : login}
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
}

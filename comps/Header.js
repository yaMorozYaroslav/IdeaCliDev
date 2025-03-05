"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMenu } from "react-icons/fi";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import * as S from "./header.styled"; // Import styles

export default function Header({ user, refreshUser }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  
  console.log("User in Header:", user); // Debugging

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
      await axios.post("http://localhost:5000/google/logout", {}, { withCredentials: true });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
   <S.HeaderContainer $isVisible={isVisible}>
  {/* Logo Section */}
  <S.LogoContainer>
    <S.LogoImage src="/IconIdea.png" alt="Idea Sphere Logo" width={80} height={80} />
    <h1>Idea Sphere</h1>
  </S.LogoContainer>

  {/* User Section: FIXED GROUPING */}
  <S.UserContainer>
    {user && 
       <>
        <S.UserAvatar src={user.picture} alt={user.name} width={40} height={40} />
        <S.UserName>{user.name}</S.UserName>
       </>
   }
    <S.AuthButton onClick={user ? handleLogout : handleLogin}>
      {user ? "Logout" : "Login with Google"}
    </S.AuthButton>
  </S.UserContainer>

  <S.MenuButton
    onClick={() => setMenuOpen(!menuOpen)}
    aria-label="Toggle menu"
    aria-expanded={menuOpen}
  >
    <FiMenu />
  </S.MenuButton>

  <S.MenuDropdown $isOpen={menuOpen}>
    <S.MenuItem>
      <FaSearch /> Search
    </S.MenuItem>
    <S.MenuItem>
      <FaInfoCircle /> About Us
    </S.MenuItem>
  </S.MenuDropdown>
</S.HeaderContainer>

  );
}

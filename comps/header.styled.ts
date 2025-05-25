import styled from "styled-components";
import Link from "next/link";

export const HeaderContainer = styled.header<{ $isVisible: boolean }>`
  position: fixed;
  top: ${({ $isVisible }) => ($isVisible ? "0" : "-100px")};
  left: 0;
  right: 0;
  width: 100%;
  background-color: #001f3f;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: top 0.3s ease-in-out;
  overflow-x: hidden;        /* ✅ prevent pushing content */
  max-width: 100vw;          /* ✅ hard limit width */
`;

export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  gap: 1rem;
  margin: 0;
  max-width: 100%;
  overflow-x: hidden;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
  }
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 40%;
  flex-shrink: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 1rem;
  overflow: hidden;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;

  h1 {
    margin: 0;
    font-size: 1.8rem;
    white-space: nowrap;
    color: white;
  }

  @media (max-width: 768px) {
    gap: 0.75rem;

    h1 {
      font-size: 2rem;
    }
  }

  @media (max-width: 400px) {
    gap: 0.3rem;
    padding-right:2%;

    h1 {
      font-size: 1.3rem;
    }
  }
`;


export const LogoImage = styled.img`
  height: 85px;
  width: auto;
  flex-shrink: 0;
`;

export const BurgerMobile = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const BurgerDesktop = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    margin-left: auto;  // ✅ Push to far right inside flex container
  }
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  color: white;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-grow: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
`;

export const UserName = styled.span`
  font-weight: 600;
  white-space: nowrap;
  margin-right: 5%;
  color: white;
`;

export const UserNameLink = styled.a`
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
  color: white;

  &:hover {
    text-decoration: underline;
  }
`;

export const UserAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const AuthButton = styled.button`
  background: #0052cc;
  color: white;
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  position: relative;

  &:hover {
    background: #0066ff;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 400px) {
    color: transparent;

    &::before {
      content: "Login";
      color: white;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  }
`;

export const MenuDropdownFixed = styled.div`
  position: fixed;
  top: 90px; /* Adjust depending on header height */
  right: 16px;
  background: white;
  color: black;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  z-index: 9999;
  min-width: 160px;
  max-width: 90vw;
  box-sizing: border-box;

  @media (max-width: 768px) {
    top: 80px;
    right: 24px;
  }
`;

export const MenuItem = styled.div`
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #f0f0f0;
  }
`;

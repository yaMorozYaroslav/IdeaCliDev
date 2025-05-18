import styled from "styled-components";
import Link from "next/link";

export const HeaderContainer = styled.header<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transform: ${({ $isVisible }) => ($isVisible ? "translateY(0)" : "translateY(-100%)")};
  transition: transform 0.3s ease;
  z-index: 1000;
`;

export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem; /* smaller padding for small screens */
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem; /* normal spacing on larger screens */
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
    width:100%;
  }
`;
export const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* split left (user) and right (burger) */
  width: 100%;
  gap: 0.75rem;
  flex-wrap: nowrap;
  flex-shrink: 0;
  min-width: 0;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem; /* closer spacing between icon and title */
  flex-shrink: 0;

  h1 {
    margin: 0;
    font-size: 1.2rem;
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    gap: 0.75rem; /* restore normal gap on desktop */
  }
`;


export const LogoImage = styled.img`
  height: 50px;
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
    margin-right:45%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    
  }
`;


export const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  color: inherit;
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
  margin-right:5%;
`;
export const UserNameLink = styled.a`
  max-width: 120px; // or whatever width fits your layout
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
`;



export const UserAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const AuthButton = styled.button`
  background: #0070f3;
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
    background: #005ad1;
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
  position: absolute;
  top: calc(100% + 8px);
  right: 2rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  z-index: 2000;
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

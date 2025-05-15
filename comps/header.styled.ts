import styled from "styled-components";
import Link from "next/link";

export const HeaderContainer = styled.header<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transform: ${({ $isVisible }) => ($isVisible ? "translateY(0)" : "translateY(-100%)")};
  transition: transform 0.3s ease;
  z-index: 1000;
`;

export const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const LogoImage = styled.img`
  height: 60px;
  width: auto;
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserName = styled.span`
  font-weight: 600;
`;

export const UserNameLink = styled(Link)`
  font-weight: 600;
  color: #0070f3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const AuthButton = styled.button`
  background: #0070f3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #005ad1;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const MenuDropdownFixed = styled.div`
  position: absolute;
  top: 100%;
  right: 2rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 0.5rem;
  overflow: hidden;
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

import styled from "styled-components";

// Header Container
export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #002244; /* Dark Blue */
  color: white;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  transform: ${({ $isVisible }) => ($isVisible ? "translateY(0)" : "translateY(-100%)")};

  @media (max-width: 480px) {
    padding: 8px 15px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Logo Section
export const LogoContainer = styled.div`
  display: flex;
  align-items: center;

  h1 {
    font-size: 1.5rem;
    margin-left: 10px;
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.2rem;
    }
  }
`;

export const LogoImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

// User Section
export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: row;
    gap: 5px;
  }
`;

// User Avatar
export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

// User Name
export const UserName = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-left: 8px;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

// Authentication Button
export const AuthButton = styled.button`
  background: #0057b7; /* Blue */
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: #0044a3;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
`;

// Menu Button (Hamburger)
export const MenuButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

// Menu Dropdown
export const MenuDropdown = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: absolute;
  top: 60px;
  right: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 1000;

  @media (max-width: 480px) {
    width: 90%;
    right: 5%;
  }
`;

// Individual Menu Item
export const MenuItem = styled.div`
  padding: 10px 15px;
  font-size: 1rem;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #ddd;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
`;

// Loading Skeleton (for Avatar & Name)
export const LoadingSkeleton = styled.div`
  background: #ddd;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
  ${({ width, height }) => `
    width: ${width}px;
    height: ${height}px;
  `}

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

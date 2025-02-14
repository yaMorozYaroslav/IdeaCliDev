import styled from "styled-components";

// Header Container (FIXED: Proper Spacing & Wrapping)
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

  @media (max-width: 768px) {
    padding: 12px;
    flex-wrap: wrap; /* Allows elements to wrap on smaller screens */
    gap: 12px; /* Adds spacing between elements */
  }
`;

// Logo Section
export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* Ensures spacing between logo and text */

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

// NEW: User Container (FIXED: Properly Groups User Avatar, Name, and Login Button)
export const UserContainer = styled.div`
  margin-left: 20%;
  display: flex;
  align-items: center;
  gap: 20px; /* Increased spacing between avatar, name, and button */

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
    gap: 10px;
  }
`;

// User Avatar
export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
  }
`;

// User Name
export const UserName = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-left: 8px;
  white-space: nowrap; /* Prevents text from breaking */

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

// Authentication Button (FIXED SPACING)
export const AuthButton = styled.button`
  background: #0057b7; /* Blue */
  color: white;
  border: none;
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.2s ease-in-out;
  margin-left: 10px; /* Ensures spacing from avatar/name */

  &:hover {
    background: #0044a3;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
`;

// FIXED: Menu Button (Hamburger)
export const MenuButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: white;
  margin-right:10%;
  cursor: pointer;
  margin-left: auto; /* Pushes button to the right */

  @media (max-width: 768px) {
    position: absolute;
    right: 15px;
    top: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    right: 10px;
  }
`;

// FIXED: Menu Dropdown Positioning
export const MenuDropdown = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  top: 60px;
  right: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 1000;
  min-width: 180px;

  @media (max-width: 480px) {
    right: 5%;
    width: 80%;
    max-width: 250px;
  }
`;

// Menu Item
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


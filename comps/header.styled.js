import styled from "styled-components";

// Flexible layout wrapper inside header
export const HeaderContainer = styled.header`
  background: #002244;
  color: white;
  position: fixed;
  width: 100%;
  max-width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 12px 20px;
  box-sizing: border-box;
  overflow-x: hidden;

  transition: transform 0.3s ease-in-out;
  transform: ${({ $isVisible }) => ($isVisible ? "translateY(0)" : "translateY(-100%)")};

  @media (max-width: 768px) {

    padding: 12px 16px;
  }
`;

export const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin-bottom:-10px;

  @media (max-width: 750px) {
    row-gap: 0px; // 👈 reduce vertical spacing between rows
  }
`;



export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom:4px;

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

  width: 90px;
  height: 90px;
  border-radius: 0%;
  margin:0px 0px 3px 0px;
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    
  }
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  // 👇 Push it to the right on larger screens
  @media (min-width: 751px) {
    margin-left: auto;
  }

  @media (max-width: 750px) {
    flex: 1 1 100%;
    justify-content: flex-end;
    order: 2;
    margin-top:-30px;
  }

  @media (max-width: 480px) {
    flex-wrap: wrap;
    margin-top:-5px;
    gap: 20px;
  }
`;


export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 45%;
  border: 2px solid white;

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
  }
`;


export const UserName = styled.p`
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const AuthButton = styled.button`
  background: #0057b7;
  color: white;
  border: none;
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: #0044a3;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 12px;
  }

  @media (max-width: 350px) {
    font-size: 0.7rem;
    padding: 8px 12px;
  }
`;

export const MenuButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: white;

  cursor: pointer;
  margin-left: auto;
  margin-top:10px;

  @media (max-width: 750px) {
  
    position: absolute;
    right: 15px;
    top: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    right: 10px;
  }
`;

export const MenuItem = styled.div`
  padding: 10px 15px;
  font-size: 1rem;
  color: #1e293b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #f1f5f9; // light hover effect
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 10px 12px;
  }
`;

export const MenuDropdownFixed = styled.div`
  position: fixed;
  top: 105px; // adjust based on your header height
  right:0px;
  
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;

  z-index: 999;
  min-width: 180px;
  display: flex;
  flex-direction: column;

  @media (max-width: 750px) {
   top:130px;
  }
  @media (max-width: 480px) {
    width: 90%;
    right:-20%;
    top:120px;
    max-width: 250px;
  }
`;

import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px; /* ✅ Keeps layout consistent */
  margin: 20px auto; /* ✅ Centers content */
  position: relative; /* ✅ Prevents jumping */
  min-height: 100vh; /* ✅ Ensures space is allocated */
`;


export const Title = styled.h2`
  font-size: 2rem;
  text-align: center;
  position: relative;
  width: 100%;
  margin-bottom: 20px; /* ✅ Ensures spacing */
  z-index: 1; /* ✅ Keeps title above expanding content */
`;


export const QuestionItem = styled.div`
    padding: 12px;
    background: #fff;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const QuestionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const QuestionTitle = styled.span`
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    color: #007aff;
    &:hover {
        text-decoration: underline;
    }
`;

export const AnswerCount = styled.span`
    font-size: 14px;
    color: #666;
    margin-left: 6px;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

export const LikeButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #e63946;
    &:hover {
        text-decoration: underline;
    }
`;

export const DeleteButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #ff3b30;
    &:hover {
        text-decoration: underline;
    }
`;

export const DetailWrapper = styled.div`
  width: 100%;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  max-height: ${({ isVisible }) => (isVisible ? "500px" : "0px")}; /* ✅ Expands smoothly */
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  overflow: hidden; /* ✅ Removes internal scrolling */
  background: white;
  padding: ${({ isVisible }) => (isVisible ? "15px" : "0px")};
  position: relative; /* ✅ Keeps content flow normal */
`;

export const LoadingMessage = styled.p`
    font-size: 14px;
    color: #666;
`;

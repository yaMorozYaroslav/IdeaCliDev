import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 800px;
  margin: 0 auto;            /* no negative margins */
  position: relative;

  /* prevent nested scrolling; let the page scroll */
  overflow: visible;
  box-sizing: border-box;
`;

export const Title = styled.h2`
  font-size: 1.8rem;
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

export const QuestionItem = styled.div`
  width: 85%;
  padding: 12px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  /* avoid horizontal scroll on long words/URLs */
  word-break: break-word;
`;

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap; /* keep icons on small screens without overflow */
`;

export const QuestionTitle = styled.span`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #007aff;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 750px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
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
  position: relative;

  /* smooth expand/collapse without its own scrollbar */
  max-height: ${({ isVisible }) => (isVisible ? "1500px" : "0px")};
  opacity: ${({ isVisible }) => (isVisible ? "1" : "0")};
  overflow: hidden;
  background: white;
  padding: ${({ isVisible }) => (isVisible ? "15px" : "0px")};
  border-radius: 6px;
  transition:
    max-height 0.24s ease-in-out,
    opacity 0.18s ease-in-out,
    padding 0.18s ease-in-out;
`;

export const LoadingMessage = styled.p`
  font-size: 14px;
  color: #666;
`;

export const AuthorName = styled.div`
  font-size: 14px;
  color: #444;
  margin-top: 4px;
  font-style: italic;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

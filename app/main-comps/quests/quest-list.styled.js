import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;

  padding-inline: clamp(12px, 4vw, 20px);
  box-sizing: border-box;
  overflow: visible;
`;

export const Title = styled.h2`
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  text-align: center;
  width: 100%;
  margin: 0 0 20px;
  position: relative;
  z-index: 1;
`;

export const QuestionItem = styled.div`
  width: 85%;
  padding: 12px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  /* avoid horizontal scroll on long words/URLs */
  word-break: break-word;
  overflow-wrap: anywhere;

  @media (max-width: 540px) {
    width: 100%;
  }

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
  }
`;

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0; /* allow text to shrink in flex */
`;

export const QuestionTitle = styled.span`
  font-size: clamp(1.1rem, 2.4vw, 1.5rem);
  font-weight: 700;
  cursor: pointer;
  color: #007aff;
  line-height: 1.2;

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
  margin-left: auto;
`;

const BaseIconButton = styled.button`
  appearance: none;
  background: none;
  border: none;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  padding: 4px 6px;
  border-radius: 8px;

  &:focus-visible {
    outline: 2px solid rgba(0, 122, 255, 0.5);
    outline-offset: 2px;
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const LikeButton = styled(BaseIconButton)`
  color: #e63946;
`;

export const DeleteButton = styled(BaseIconButton)`
  color: #ff3b30;
`;

export const DetailWrapper = styled.div.withConfig({
  // prevent custom prop from reaching the DOM
  shouldForwardProp: (p) => p !== "isVisible",
})`
  --expand-duration: 0.24s;
  --fade-duration: 0.18s;

  width: 100%;
  position: relative;
  will-change: max-height, opacity, padding;

  max-height: ${({ isVisible }) => (isVisible ? "1500px" : "0px")};
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  overflow: hidden;
  background: #fff;
  padding: ${({ isVisible }) => (isVisible ? "15px" : "0px")};
  border-radius: 8px;

  transition:
    max-height var(--expand-duration) ease-in-out,
    opacity var(--fade-duration) ease-in-out,
    padding var(--fade-duration) ease-in-out;
`;

export const LoadingMessage = styled.p`
  font-size: 14px;
  color: #666;
  margin: 6px 0 0;
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

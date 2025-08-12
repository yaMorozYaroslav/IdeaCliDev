"use client";

import styled, { keyframes, css } from "styled-components";

/* Section shell */
export const SectionWrapper = styled.section`
  margin-top: 2rem;
  padding: 0 1rem;
`;

export const SectionTitle = styled.h2`
  text-align: center;
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

/* Cards and text */
export const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff;

  ${({ $indentLeft }) =>
    $indentLeft &&
    css`
      padding-left: ${$indentLeft};
    `}
`;

export const Title = styled.p`
  font-weight: 700;
  margin: 0;
`;
export const TitleGroup = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;      /* right-align both lines */
  max-width: 100%;
  margin-bottom: 10px;
`;

export const ByLine = styled.p`
  /* sits under Title, aligned to its right edge */
  margin: 0.2rem 0 0;
  font-size: 0.8em;
  color: #666;

  /* sizing rules: at least N chars wide, but never overflow the card */
  min-width: 10ch;            /* adjust to taste */
  max-width: 100%;            /* cap to container */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* if you prefer wrapping on tiny screens, let it wrap instead of ellipsis: */
  @media (max-width: 420px) {
    white-space: normal;
  }
`;





export const Meta = styled.p`
  font-size: 0.9em;
  color: #666;
  margin: 0 0 0.5rem;
`;

export const AnswerBlock = styled.div`
  margin-top: 1rem;
  border-left: 3px solid #333;
  padding-left: ${({ $indentLeft }) => ($indentLeft ? $indentLeft : "1rem")};

  p {
    margin: 0.25rem 0;
  }
`;

export const AnswerAuthor = styled.p`
  font-size: 0.8em;
  color: #999;
  margin: 0.25rem 0 0;
`;

/* Loading/empty states */
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #333;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 1rem;
`;

export const LoadingWrap = styled.div`
  text-align: center;
  padding: 1rem;
`;

export const EmptyState = styled.p`
  text-align: center;
  color: #666;
  margin: 0.5rem 0 0;
`;

/* Buttons */
/* Buttons */
export const PrimaryButton = styled.button`
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  cursor: pointer;
  background: #0052cc;
  color: #fff;
  border: none;
  border-radius: 4px;
  transition: background 120ms ease;

  &:hover {
    background: #0066ff;
  }

  /* Danger variant (triggered by data attribute) */
  &[data-danger="true"] {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    background: #cc0000;
  }
  &[data-danger="true"]:hover {
    background: #e00000;
  }
`;

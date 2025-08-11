// app/profiles/[userId]/section.styled.js
"use client";

import styled, { keyframes, css } from "styled-components";

/* Section shell */
export const SectionWrapper = styled.section`
  margin-top: 2rem; /* consistent gap before each section */
  padding: 0 1rem;
`;

export const SectionTitle = styled.h2`
  text-align: center;
  margin: 0 0 1rem; /* remove default top margin */
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

  /* optional left indent for all inner content */
  ${({ $indentLeft }) =>
    $indentLeft &&
    css`
      padding-left: ${$indentLeft};
    `}
`;

export const Title = styled.p`
  font-weight: 700;
  margin: 0 0 0.25rem;
`;

export const Meta = styled.p`
  font-size: 0.9em;
  color: #666;
  margin: 0 0 0.5rem;
`;

export const ByLine = styled.p`
  font-size: 0.9em;
  color: #666;
  margin: 0.25rem 0 0.5rem;
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

  ${({ $danger }) =>
    $danger &&
    css`
      background: #cc0000;
      color: #fff;

      &:hover {
        background: #e00000;
      }
    `}
`;

import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  background: white;
  overflow: visible;
  min-height: calc(100vh - 80px);

  @media (max-width: 480px) {
    width: 98%;
  }
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;

  @media (max-width: 750px) {
    /* Reserved for potential future adjustments */
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding: 25px;
  background: white;
  border-radius: 8px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  width: 40%;

  @media (max-width: 750px) {
    width: 55%;
  }

  @media (max-width: 480px) {
    width: 70%;
  }
`;

export const QuestionInput = styled.input`
  width: 93%;
  margin-top: -19px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

export const SubmitButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #0056b3;
  }
`;

export const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
`;

export const NoQuestionsMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #888;
`;

const bounce = keyframes`
  0% { transform: translateX(0); }
  50% { transform: translateX(10px); }
  100% { transform: translateX(0); }
`;

export const DotLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

export const BouncingDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: #64748b;
  border-radius: 50%;
  animation: ${bounce} 0.6s infinite ease-in-out;
`;

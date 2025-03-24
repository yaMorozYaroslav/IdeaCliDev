import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%; /* ✅ Expands width while keeping margins */
  max-width: 1200px; /* ✅ Allows full width on larger screens */
  margin: 0 auto;
  position: relative; /* ✅ Keeps normal scrolling behavior */
  background: white;
  overflow: visible; /* ✅ Prevents extra scrollbar inside */
  min-height: calc(100vh - 80px); /* ✅ Prevents cutting off content */
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
`;

export const QuestionInput = styled.input`
  width: 100%;
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

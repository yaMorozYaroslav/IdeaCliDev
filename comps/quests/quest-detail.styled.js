import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 5px;
`;

export const Author = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
`;

export const Likes = styled.p`
  font-size: 1rem;
  color: #007bff;
  margin-bottom: 15px;
`;

export const AnswerTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #444;
`;

export const AnswerItem = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  background: #f9f9f9;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
`;

export const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #28a745;
  &:hover {
    color: #218838;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #dc3545;
  &:hover {
    color: #c82333;
  }
`;

export const AnswerForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;

export const AnswerInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
`;

export const SubmitButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #0056b3;
  }
`;

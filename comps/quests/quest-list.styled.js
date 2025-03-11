import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
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

export const QuestionItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: #fff;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
`;

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const QuestionTitle = styled.h3`
  cursor: pointer;
  color: #007bff;
  &:hover {
    text-decoration: underline;
  }
`;

export const AnswerCount = styled.span`
  font-size: 0.9rem;
  color: #555;
  margin-left: 8px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
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

export const DetailWrapper = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

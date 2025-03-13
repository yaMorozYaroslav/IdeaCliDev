import styled from "styled-components";

// ✅ Container for Question Detail (Responsive Layout)
export const Container = styled.div`
  width: 100%;
  max-width: 900px; /* ✅ Limits width on larger screens */
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  @media (max-width: 1024px) {
    max-width: 95%;
    padding: 15px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    border-radius: 4px;
  }
`;

// ✅ Question Title (Ensures readability on small screens)
export const QuestionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

// ✅ Question Content (Responsive Text)
export const QuestionContent = styled.p`
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  text-align: left;
  padding: 10px;
  border-left: 4px solid #007bff;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 6px;
  }
`;

// ✅ Answers Container (Handles Layout Responsively)
export const AnswersContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    margin-top: 15px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    margin-top: 10px;
    gap: 8px;
  }
`;

// ✅ Individual Answer Item (Prevents Overflow)
export const AnswerItem = styled.div`
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    padding: 10px;
    border-radius: 5px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    border-radius: 4px;
  }
`;

// ✅ Answer Content (Readable on Small Screens)
export const AnswerContent = styled.p`
  font-size: 1rem;
  color: #444;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

// ✅ Action Buttons (Like/Delete)
export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

// ✅ Like Button (Increases Tap Target on Mobile)
export const LikeButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #007bff;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// ✅ Delete Button
export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: red;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: darkred;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// ✅ Answer Form (Responsive Input Box)
export const AnswerForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

// ✅ Input Box for Answer Submission
export const AnswerInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px;
  }
`;

// ✅ Submit Button
export const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.2s ease-in-out;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px;
  }
`;

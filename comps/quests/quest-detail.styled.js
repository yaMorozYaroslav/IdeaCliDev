import styled from "styled-components";

export const Container = styled.div`
    padding: 16px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
`;

export const QuestionTitle = styled.h2`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
`;

export const QuestionContent = styled.p`
    font-size: 16px;
    margin-bottom: 16px;
`;

export const AnswersContainer = styled.div`
    margin-top: 20px;
`;

export const AnswerItem = styled.div`
    padding: 12px;
    background: #fff;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const AnswerContent = styled.p`
    font-size: 14px;
    margin-bottom: 8px;
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
    color: #007aff;
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

export const AnswerForm = styled.form`
    margin-top: 20px;
    display: flex;
    gap: 10px;
`;

export const AnswerInput = styled.input`
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
`;

export const SubmitButton = styled.button`
    background: #007aff;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

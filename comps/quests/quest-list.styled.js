import styled from "styled-components";

export const Container = styled.div`
    padding: 16px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
`;

export const Title = styled.h1`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 16px;
`;

export const QuestionItem = styled.div`
    padding: 12px;
    background: #fff;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const QuestionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const QuestionTitle = styled.span`
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    color: #007aff;
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

export const DetailWrapper = styled.div`
    margin-top: 10px;
    padding: 10px;
    background: #f1f1f1;
    border-radius: 6px;
`;

export const LoadingMessage = styled.p`
    font-size: 14px;
    color: #666;
`;

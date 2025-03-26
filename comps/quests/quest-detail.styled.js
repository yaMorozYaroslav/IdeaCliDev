import styled from "styled-components";

export const Container = styled.div`
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    max-width: 800px;
    margin-left: -5%;
  @media (max-width: 480px) {
    width:80%;
  }
`;

export const QuestionTitle = styled.h2`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
`;

export const QuestionContent = styled.p`
    font-size: 16px;
    margin-bottom: 20px;
`;

export const DeleteButton = styled.button`
    background: #ff4d4d;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
    margin-bottom: 10px;

    &:hover {
        background: #cc0000;
    }
`;

export const AnswersContainer = styled.div`
    margin-top: 20px;
    max-height: 250px;
    overflow-y: auto;
    border-top: 1px solid #ddd;
    padding-top: 10px;
`;

export const AnswerList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const AnswerItem = styled.div`
    padding: 10px;
    background: #f9f9f9;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const AnswerContent = styled.p`
    font-size: 18px;
    margin: 0;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
`;

export const LikeButton = styled.button`
    background: #ffcc00;
    color: black;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #e6b800;
    }
`;

export const AnswerForm = styled.form`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const AnswerInput = styled.input`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 95%;
`;

export const SubmitButton = styled.button`
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #0056b3;
    }
`;

export const ScrollMessage = styled.p`
    font-size: 12px;
    color: #777;
    text-align: center;
    margin-top: 10px;
`;

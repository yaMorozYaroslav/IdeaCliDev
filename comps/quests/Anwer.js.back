import { useState, useEffect } from "react";
import axios from "axios";

const Answer = ({ answer, questionId, userId }) => {
  const [likes, setLikes] = useState(answer.likes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check if the answer is already liked
    if (userId) {
      setLiked(answer.likesBy?.includes(userId));
    } else {
      const likedAnswers = JSON.parse(localStorage.getItem("likedAnswers")) || [];
      setLiked(likedAnswers.includes(answer._id));
    }
  }, [answer._id, userId, answer.likesBy]);

  const toggleLike = async () => {
    try {
      if (!userId) {
        // Handle likes for logged-out users using localStorage
        let likedAnswers = JSON.parse(localStorage.getItem("likedAnswers")) || [];

        if (likedAnswers.includes(answer._id)) {
          likedAnswers = likedAnswers.filter(id => id !== answer._id);
          setLikes(likes - 1);
        } else {
          likedAnswers.push(answer._id);
          setLikes(likes + 1);
        }

        localStorage.setItem("likedAnswers", JSON.stringify(likedAnswers));
        setLiked(!liked);
        return;
      }

      // If user is logged in, send API request
      const response = await axios.post(`/api/like-answer/${questionId}/${answer._id}`, { userId });
      const updatedAnswer = response.data.answers.find(a => a._id === answer._id);

      setLikes(updatedAnswer.likes);
      setLiked(updatedAnswer.likesBy.includes(userId));
    } catch (error) {
      console.error("Error liking answer:", error);
    }
  };

  return (
    <div>
      <p>{answer.content}</p>
      <button onClick={toggleLike} style={{ color: liked ? "blue" : "gray" }}>
        👍 {likes}
      </button>
    </div>
  );
};

export default Answer;

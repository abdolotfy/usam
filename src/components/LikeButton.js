import React, { useState } from 'react';
import './LikeButton.css';

function LikeButton({ courseId }) {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    // Implement your logic to toggle like status and update backend if needed
    setLiked(!liked);
  };

  return (
    <button className={`like-button ${liked ? 'active' : ''}`} onClick={handleLikeClick}>
      {liked ? 'Liked!' : 'Like'}
    </button>
  );
}

export default LikeButton;

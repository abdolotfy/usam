import React, { useState } from 'react';
import './AddCommentAndRate.css';

function AddCommentAndRate({ courseId }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0); // Assuming rating is on a scale of 1 to 5

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value, 10));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your logic to submit comment and rating
    console.log('Comment:', comment);
    console.log('Rating:', rating);
    // Reset form or perform other actions after submission
    setComment('');
    setRating(0);
  };

  return (
    <div className="add-comment-and-rate">
      <form className="add-comment-form" onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write your comment here..."
          rows={4}
        />
        <button type="submit">Add Comment</button>
      </form>
      <div className="rating-container">
        <span className="rating-label">Rate this course:</span>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <React.Fragment key={value}>
              <input
                type="radio"
                id={`rating-${value}`}
                name="rating"
                value={value}
                checked={rating === value}
                onChange={handleRatingChange}
              />
              <label htmlFor={`rating-${value}`}>★</label>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddCommentAndRate;

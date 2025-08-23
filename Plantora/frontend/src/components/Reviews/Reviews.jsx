import React, { useState, useEffect } from 'react';
import styles from './Reviews.module.css';
import { reviewAPI } from '../../services/reviewAPI';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState('');

  // Fetch reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewAPI.getProductReviews(productId);
      setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (comment.trim() && rating > 0) {
      try {
        const data = await reviewAPI.createReview({ productId, rating, comment });

        // If already reviewed, update it
        if (data.error === 'alreadyReviewed') {
          const updated = await reviewAPI.updateReview(data.existingReviewId, { rating, comment });
          setReviews((prev) =>
            prev.map((r) => (r._id === updated.review._id ? updated.review : r))
          );
        } else {
          // Add new review to top
          setReviews([data.review, ...reviews]);
        }

        setRating(0);
        setComment('');
      } catch (err) {
        setError(err.message || 'Failed to submit review');
      }
    }
  };

  const handleLike = async (reviewId) => {
    try {
      const data = await reviewAPI.toggleLikeReview(reviewId);
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, likes: data.likes, isLiked: data.isLiked }
            : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplySubmit = async (e, reviewId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const data = await reviewAPI.addReply(reviewId, replyText);
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, replies: [...r.replies, data.reply] }
            : r
        )
      );
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.reviewsContainer}>
      <h2 className={styles.sectionTitle}>Customer Feedback</h2>
      {error && <p className={styles.error}>{error}</p>}

      {reviews.map((review) => (
        <div key={review._id} className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <span className={styles.author}>{review.userName}</span>
            <span className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`${styles.star} ${i < review.rating ? styles.filled : ''}`}
                >
                  ★
                </span>
              ))}
            </span>
            <span className={styles.timestamp}>
              {new Date(review.createdAt).toLocaleString()}
            </span>
          </div>

          <p className={styles.reviewText}>{review.comment}</p>

          <div className={styles.actions}>
            <button
              className={`${styles.actionButton} ${review.isLiked ? styles.liked : ''}`}
              onClick={() => handleLike(review._id)}
            >
              👍 Like ({review.likes.length})
            </button>

            <button
              className={styles.actionButton}
              onClick={() =>
                setReplyingTo(replyingTo === review._id ? null : review._id)
              }
            >
              💬 Reply
            </button>
          </div>

          {replyingTo === review._id && (
            <form
              onSubmit={(e) => handleReplySubmit(e, review._id)}
              className={styles.replyForm}
            >
              <textarea
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className={styles.replyTextarea}
              />
              <div className={styles.replyButtons}>
                <button type="submit" className={styles.submitReply}>
                  Submit
                </button>
                <button
                  type="button"
                  className={styles.cancelReply}
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {review.replies.length > 0 && (
            <div className={styles.repliesContainer}>
              {review.replies.map((reply) => (
                <div key={reply._id || reply.id} className={styles.replyCard}>
                  <div className={styles.replyHeader}>
                    <span className={styles.replyAuthor}>{reply.userName}</span>
                    <span className={styles.replyTimestamp}>
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className={styles.replyText}>{reply.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <h3 className={styles.formTitle}>Write a Review</h3>

        <div className={styles.formGroup}>
          <label className={styles.label}>Rating</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${star <= rating ? styles.filled : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Your Review</label>
          <textarea
            placeholder="Write your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textarea}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Reviews;

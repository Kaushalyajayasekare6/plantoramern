import React, { useState, useEffect } from 'react';
import styles from './Reviews.module.css';
import { reviewAPI } from '../../services/api';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch reviews when component mounts or productId changes
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getReviews(productId);
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!comment.trim() || rating === 0) {
      setError('Please provide both a rating and comment');
      return;
    }

    try {
      const response = await reviewAPI.createReview({
        productId,
        rating,
        comment
      });

      if (response.data.message === 'You have already reviewed this product') {
        setError('You have already reviewed this product');
        return;
      }

      // Refresh reviews after successful submission
      fetchReviews();
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleLike = async (reviewId) => {
    try {
      await reviewAPI.toggleLikeReview(reviewId);
      // Refresh reviews to get updated like count
      fetchReviews();
    } catch (err) {
      console.error('Error liking review:', err);
      setError('Failed to like review');
    }
  };

  const handleReplySubmit = async (e, reviewId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await reviewAPI.addReply(reviewId, { comment: replyText });
      setReplyText('');
      setReplyingTo(null);
      // Refresh reviews to show the new reply
      fetchReviews();
    } catch (err) {
      console.error('Error submitting reply:', err);
      setError('Failed to submit reply');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading reviews...</div>;
  }

  return (
    <div className={styles.reviewsContainer}>
      <h2 className={styles.sectionTitle}>Customer Reviews</h2>
      {error && <p className={styles.error}>{error}</p>}

      {/* Review Form */}
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
            placeholder="Share your experience with this product"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textarea}
            rows="4"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit Review
        </button>
      </form>

      {/* Reviews List */}
      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
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
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className={styles.reviewText}>{review.comment}</p>

              <div className={styles.actions}>
                <button
                  className={`${styles.actionButton} ${review.isLiked ? styles.liked : ''}`}
                  onClick={() => handleLike(review._id)}
                >
                  👍 Like ({review.likes?.length || 0})
                </button>

                <button
                  className={styles.actionButton}
                  onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)}
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
                    rows="2"
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

              {review.replies && review.replies.length > 0 && (
                <div className={styles.repliesContainer}>
                  {review.replies.map((reply) => (
                    <div key={reply._id || reply.id} className={styles.replyCard}>
                      <div className={styles.replyHeader}>
                        <span className={styles.replyAuthor}>{reply.userName}</span>
                        <span className={styles.replyTimestamp}>
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={styles.replyText}>{reply.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
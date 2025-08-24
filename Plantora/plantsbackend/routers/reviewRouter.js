import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
  addReply
} from '../controllers/reviewController.js';
import { auth } from '../middleware/auth.js';

const reviewRouter = express.Router();

// Public route - get reviews for a product
reviewRouter.get('/product/:productId', getProductReviews);

// Protected routes - require authentication
reviewRouter.post('/', auth, createReview);
reviewRouter.put('/:reviewId', auth, updateReview);
reviewRouter.delete('/:reviewId', auth, deleteReview);
reviewRouter.post('/:reviewId/like', auth, toggleLikeReview);
reviewRouter.post('/:reviewId/reply', auth, addReply);

export default reviewRouter;
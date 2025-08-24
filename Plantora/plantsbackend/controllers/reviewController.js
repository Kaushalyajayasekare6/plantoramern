import User from '../models/user.js';
import Review from '../models/Review.js';
import Product from '../models/product.js';

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ productId })
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Check if user has liked each review
    if (req.user && req.user.id) {
      const userId = req.user.id;
      const reviewsWithLikes = reviews.map(review => {
        const reviewObj = review.toObject();
        reviewObj.isLiked = reviewObj.likes.includes(userId);
        return reviewObj;
      });
      
      return res.json({
        reviews: reviewsWithLikes,
        totalReviews: reviewsWithLikes.length
      });
    }

    res.json({
      reviews,
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.user.id;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const review = new Review({
      productId,
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      rating,
      comment
    });

    await review.save();

    // Update product average rating
    await updateProductRating(productId);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update product average rating
    await updateProductRating(review.productId);

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.user.id;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);

    // Update product average rating
    await updateProductRating(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};

// Like/Unlike a review
export const toggleLikeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const isLiked = review.likes.includes(userId);
    
    if (isLiked) {
      review.likes.pull(userId);
    } else {
      review.likes.push(userId);
    }

    await review.save();

    res.json({
      message: isLiked ? 'Review unliked' : 'Review liked',
      likes: review.likes,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// Add reply to review
export const addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const reply = {
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      comment,
      createdAt: new Date()
    };

    review.replies.push(reply);
    await review.save();

    res.status(201).json({
      message: 'Reply added successfully',
      reply: review.replies[review.replies.length - 1]
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Failed to add reply' });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Product.findOneAndUpdate(
      { productId: productId },
      { 
        rating: Math.round(averageRating * 2) / 2, // Round to nearest 0.5
        reviewCount: reviews.length 
      }
    );
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};
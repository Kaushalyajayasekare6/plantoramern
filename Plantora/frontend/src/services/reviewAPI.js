const API_BASE_URL = 'http://localhost:5000/api';

export const reviewAPI = {
  // Get reviews for a product
  getReviews: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch reviews' }));
        throw new Error(errorData.message || 'Failed to fetch reviews');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Create a review
  createReview: async (reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create review');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update review');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete review' }));
        throw new Error(errorData.message || 'Failed to delete review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Like/Unlike a review
  toggleLikeReview: async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle like');
      }
      
      return data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Add reply to review
  addReply: async (reviewId, replyData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(replyData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add reply');
      }
      
      return data;
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  }
};
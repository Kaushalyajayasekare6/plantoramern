const API_BASE_URL = 'http://localhost:5000/api';

// ------------------- PRODUCT API -------------------
export const productAPI = {
  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getProductInfo: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product info');
    return response.json();
  },

  createProduct: async (productData) => {
    const options = productData instanceof FormData
      ? { method: 'POST', body: productData }
      : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) };

    const response = await fetch(`${API_BASE_URL}/products`, options);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to create product');
    }
    return response.json();
  },

  updateProduct: async (productId, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to update product');
    }
    return response.json();
  },

  deleteProduct: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to delete product');
    }
    return response.json();
  }
};

// ------------------- USER API -------------------
export const userAPI = {
  signupUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to sign up');
    return data;
  },

  loginUser: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to login');
    return data;
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },

  updateUserRole: async (userId, roleData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleData)
    });
    if (!response.ok) throw new Error('Failed to update user role');
    return response.json();
  }
};

// ------------------- REVIEW API -------------------
export const reviewAPI = {
  getProductReviews: async (productId, page = 1, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  createReview: async (reviewData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create review');
    return data;
  },

  updateReview: async (reviewId, reviewData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update review');
    return data;
  },

  deleteReview: async (reviewId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete review');
    return data;
  },

  toggleLikeReview: async (reviewId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to toggle like');
    return data;
  },

  addReply: async (reviewId, comment) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ comment })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add reply');
    return data;
  }
};

// ------------------- CART API -------------------
export const cartAPI = {
  getCart: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  addToCart: async (productId, quantity) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId, quantity })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  updateCartItem: async (productId, quantity) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ productId, quantity })
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return response.json();
  },

  removeCartItem: async (productId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to remove cart item');
    return response.json();
  }
};

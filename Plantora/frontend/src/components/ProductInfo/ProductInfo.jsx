import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import styles from './ProductInfo.module.css';
import plantImage from '../../assets/images/plant.png';

const ProductInfo = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { productId } = useParams();
  const { addToCart } = useCart();
  
  // State management
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to load product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // If we have product data from navigation state, use it immediately
        if (state?.product) {
          setProductData(state.product);
          setLoading(false);
          return;
        }
        
        // Otherwise, fetch from API using productId
        if (productId) {
          const data = await productAPI.getProductInfo(productId);
          
          // Transform backend data to frontend format
          const transformedProduct = {
            ...data,
            id: data._id || data.productId || productId,
            name: data.name || data.title,
            title: data.title || data.name,
            images: data.images && data.images.length > 0
              ? data.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`)
              : [plantImage],
            rating: data.rating || 4.5,
            price: data.price,
            isAvailable: data.isAvailable !== false,
            description: data.description || 'No description available',
            category: data.category || 'Plants'
          };
          
          setProductData(transformedProduct);
        } else {
          throw new Error('No product ID provided');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError(error.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, state]);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!productData) return;
    
    setCartLoading(true);
    try {
      await addToCart(productData, quantity);
      
      // Show success message or navigate to cart
      alert('Product added to cart successfully!');
      // Uncomment the line below if you want to navigate to cart after adding
      // navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  // Handle Buy Now
  const handleBuyNow = async () => {
    if (!productData) return;
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If user is not logged in, redirect to login
      navigate('/login', { 
        state: { 
          from: `/productoverview/${productId}`,
          action: 'buyNow'
        }
      });
      return;
    }
    
    setCartLoading(true);
    try {
      await addToCart(productData, quantity);
      navigate('/checkout');
    } catch (error) {
      console.error('Error processing buy now:', error);
      alert('Failed to proceed to checkout. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  // Quantity controls
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  // Get the image URL with proper fallbacks
  const getImageUrl = () => {
    if (!productData || !productData.images || productData.images.length === 0) {
      return plantImage;
    }
    
    const imageUrl = productData.images[0];
    // Ensure the URL is properly formatted
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:5000${imageUrl}`;
    } else {
      return plantImage;
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className={`${styles.star} ${styles.filled}`}>
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className={`${styles.star} ${styles.halfFilled}`}>
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className={styles.star}>
            ☆
          </span>
        );
      }
    }

    return stars;
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.productContainer}>
        <div className={styles.loading}>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.productContainer}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button 
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No product data
  if (!productData) {
    return (
      <div className={styles.productContainer}>
        <div className={styles.error}>
          <p>Product not found</p>
          <button 
            onClick={() => navigate('/products')}
            className={styles.backButton}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productContainer}>
      <div className={styles.imageContainer}>
        <img 
          src={getImageUrl()} 
          alt={productData.name || productData.title} 
          className={styles.productImage}
          onError={(e) => {
            e.target.src = plantImage;
          }}
        />
      </div>
      
      <div className={styles.productDetails}>
        {/* Rating Stars */}
        <div className={styles.stars}>
          {renderStars(productData.rating || 5)}
          <span className={styles.ratingText}>({productData.rating || 5})</span>
        </div>

        <h1 className={styles.productTitle}>
          {productData.name || productData.title}
        </h1>
        
        {/* Category */}
        {productData.category && (
          <div className={styles.category}>
            Category: {productData.category}
          </div>
        )}
        
        <div className={styles.price}>
          LKR {typeof productData.price === 'number' 
            ? productData.price.toFixed(2) 
            : productData.price}
        </div>
        
        <div className={styles.stock}>
          <span className={productData.isAvailable ? styles.inStock : styles.outOfStock}>
            {productData.isAvailable ? '✓ In stock' : '✗ Out of stock'}
          </span>
        </div>
        
        <div className={styles.description}>
          <h3>Description</h3>
          <p>{productData.description}</p>
        </div>
        
        <div className={styles.quantitySelector}>
          <label>Quantity:</label>
          <div className={styles.quantityControls}>
            <button 
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className={styles.quantityButton}
            >
              -
            </button>
            <span className={styles.quantityDisplay}>{quantity}</span>
            <button 
              onClick={increaseQuantity}
              className={styles.quantityButton}
            >
              +
            </button>
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button 
            className={styles.addToCart}
            onClick={handleAddToCart}
            disabled={!productData.isAvailable || cartLoading}
          >
            {cartLoading ? 'Adding...' : 'Add to cart'}
          </button>
          <button 
            className={styles.buyNow}
            onClick={handleBuyNow}
            disabled={!productData.isAvailable || cartLoading}
          >
            {cartLoading ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import styles from './ProductInfo.module.css';
import plantImage from '../../assets/images/plant.png';

const ProductInfo = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { productId } = useParams();
  const { addToCart, items } = useCart();
  
  const getInitialProduct = () => {
    if (state?.product) {
      return state.product;
    }
    return {
      productId: productId || "1",
      name: "Loading...",
      price: 0.00,
      rating: 5,
      description: "Loading product details...",
      isAvailable: true,
      images: [plantImage]
    };
  };

  const [productData, setProductData] = useState(getInitialProduct());
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  React.useEffect(() => {
    if (!state?.product && productId) {
      fetchProductById(productId);
    }
  }, [productId, state]);

  const fetchProductById = async (id) => {
    setLoading(true);
    try {
      const data = await productAPI.getProductInfo(id);
      
      const transformedProduct = {
        ...data,
        id: data._id || data.productId,
        name: data.name,
        images: data.images?.length > 0
          ? data.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`)
          : [plantImage],
        rating: data.rating || 4.5,
        price: data.price,
        isAvailable: data.isAvailable !== false,
        description: data.description || 'No description available',
        category: data.category || 'General'
      };
      
      setProductData(transformedProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const product = productData;

  const handleAddToCart = async () => {
    setCartLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // If user is not logged in, use local cart context instead of API
      if (!token) {
        // Add to local cart context with all product details
        await addToCart(product, quantity);
        navigate('/cart');
        return;
      }
      
      // If user is logged in, use the API
      await addToCart(product, quantity);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setCartLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Redirect to login with return URL for buy now
        navigate('/checkout', { state: { from: `/productoverview/${productId}`, action: 'buyNow' } });
        return;
      }
      
      await addToCart(product, quantity);
      navigate('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to proceed to checkout. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const getImageUrl = () => {
    const imageUrl = product.images?.[0];
    if (!imageUrl) return plantImage;
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
  };

  if (loading) {
    return <div className={styles.loading}>Loading product details...</div>;
  }

  return (
    <div className={styles.productContainer}>
      <div className={styles.imageContainer}>
        <img 
          src={getImageUrl()} 
          alt={product.name} 
          className={styles.productImage}
          onError={(e) => { e.target.src = plantImage; }}
        />
      </div>
      
      <div className={styles.productDetails}>
        <div className={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`${styles.star} ${i < (product.rating || 5) ? styles.filled : ''}`}
            >
              ★
            </span>
          ))}
          <span className={styles.ratingText}>({product.rating || 5})</span>
        </div>

        <h1 className={styles.productTitle}>{product.name}</h1>
        
        {product.category && (
          <div className={styles.category}>
            Category: {product.category}
          </div>
        )}
        
        <div className={styles.price}>LKR {product.price?.toFixed(2)}</div>
        
        <div className={styles.stock}>
          <span className={product.isAvailable ? styles.inStock : styles.outOfStock}>
            {product.isAvailable ? '✓ In stock' : '✗ Out of stock'}
          </span>
        </div>
        
        <div className={styles.description}>
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
        
        <div className={styles.quantitySelector}>
          <label>Quantity:</label>
          <div className={styles.quantityControls}>
            <button onClick={decreaseQuantity} disabled={quantity <= 1} className={styles.quantityButton}>-</button>
            <span className={styles.quantityDisplay}>{quantity}</span>
            <button onClick={increaseQuantity} className={styles.quantityButton}>+</button>
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button 
            className={styles.addToCart} 
            onClick={handleAddToCart} 
            disabled={!product.isAvailable || cartLoading}
          >
            {cartLoading ? 'Adding...' : 'Add to cart'}
          </button>
          <button 
            className={styles.buyNow} 
            onClick={handleBuyNow} 
            disabled={!product.isAvailable || cartLoading}
          >
            {cartLoading ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
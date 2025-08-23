import React, { createContext, useContext, useState, useEffect } from "react";
import { cartAPI } from "../services/api";
import plantImage from "../assets/plants/plant1.jpg";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      // User is logged in, fetch cart from database
      fetchCart();
    } else {
      // User is not logged in, try to load from localStorage
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      setLoading(false);
    }
  }, []);

  // Save guest cart to localStorage whenever it changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && items.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(items));
    }
  }, [items]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const cartData = await cartAPI.getCart();
      const transformedItems = cartData.items.map(item => ({
        id: item.productId._id,
        title: item.productId.name,
        price: item.productId.price,
        qty: item.quantity,
        img: item.productId.images?.[0] ? 
          `http://localhost:5000${item.productId.images[0]}` : 
          plantImage
      }));
      
      setItems(transformedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productData, quantity) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // User is logged in, use API
        await cartAPI.addToCart(productData.id, quantity);
        await fetchCart(); // Refresh cart data
      } else {
        // User is not logged in, use local state
        setItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === productData.id);
          
          if (existingItem) {
            // Update quantity if item already exists
            return prevItems.map(item =>
              item.id === productData.id
                ? { ...item, qty: item.qty + quantity }
                : item
            );
          } else {
            // Add new item with all product details
            const newItem = {
              id: productData.id,
              title: productData.name,
              price: productData.price,
              qty: quantity,
              img: productData.images?.[0] || plantImage
            };
            return [...prevItems, newItem];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const increment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const item = items.find(it => it.id === id);
        if (item) {
          await cartAPI.updateCartItem(id, item.qty + 1);
          await fetchCart();
        }
      } else {
        setItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
          )
        );
      }
    } catch (error) {
      console.error('Error incrementing item:', error);
    }
  };

  const decrement = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const item = items.find(it => it.id === id);
        if (item) {
          if (item.qty > 1) {
            await cartAPI.updateCartItem(id, item.qty - 1);
          } else {
            await cartAPI.removeCartItem(id);
          }
          await fetchCart();
        }
      } else {
        setItems(prev => {
          const next = prev
            .map(item => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
            .filter(item => item.qty > 0);
          return next;
        });
      }
    } catch (error) {
      console.error('Error decrementing item:', error);
    }
  };

  const remove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await cartAPI.removeCartItem(id);
        await fetchCart();
      } else {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Function to merge guest cart with user cart after login
  const mergeCarts = async (guestItems) => {
    try {
      for (const item of guestItems) {
        await cartAPI.addToCart(item.id, item.qty);
      }
      await fetchCart(); // Refresh cart data
      localStorage.removeItem('guestCart'); // Clear guest cart
    } catch (error) {
      console.error('Error merging carts:', error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      loading, 
      increment, 
      decrement, 
      remove, 
      addToCart, 
      fetchCart,
      mergeCarts
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
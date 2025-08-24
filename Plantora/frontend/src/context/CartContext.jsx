import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "../services/api";
import plantImage from "../assets/plants/plant1.jpg";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: get token
  const getToken = () => localStorage.getItem("token");

  // Load cart from server or localStorage
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const cartData = await cartAPI.getCart();
      const transformedItems = cartData.items.map((item) => ({
        id: item.productId._id,
        title: item.productId.name,
        price: item.productId.price,
        qty: item.quantity,
        img: item.productId.images?.[0]
          ? `http://localhost:5000${item.productId.images[0]}`
          : plantImage,
      }));
      setItems(transformedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial cart
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchCart();
    } else {
      const savedCart = localStorage.getItem("guestCart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      setLoading(false);
    }
  }, [fetchCart]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!getToken()) {
      localStorage.setItem("guestCart", JSON.stringify(items));
    }
  }, [items]);

  // Add item to cart
  const addToCart = async (productData, quantity = 1) => {
    try {
      const token = getToken();
      if (token) {
        await cartAPI.addToCart(productData.id, quantity);
        await fetchCart();
      } else {
        setItems((prevItems) => {
          const existing = prevItems.find((i) => i.id === productData.id);
          if (existing) {
            return prevItems.map((i) =>
              i.id === productData.id ? { ...i, qty: i.qty + quantity } : i
            );
          } else {
            return [
              ...prevItems,
              {
                id: productData.id,
                title: productData.name,
                price: productData.price,
                qty: quantity,
                img: productData.images?.[0] || plantImage,
              },
            ];
          }
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  // Increment item quantity
  const increment = async (id) => {
    const token = getToken();
    if (token) {
      const item = items.find((i) => i.id === id);
      if (item) {
        try {
          await cartAPI.updateCartItem(id, item.qty + 1);
          await fetchCart();
        } catch (error) {
          console.error("Error incrementing item:", error);
        }
      }
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
      );
    }
  };

  // Decrement item quantity
  const decrement = async (id) => {
    const token = getToken();
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (token) {
      try {
        if (item.qty > 1) {
          await cartAPI.updateCartItem(id, item.qty - 1);
        } else {
          await cartAPI.removeCartItem(id);
        }
        await fetchCart();
      } catch (error) {
        console.error("Error decrementing item:", error);
      }
    } else {
      setItems((prev) =>
        prev
          .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0)
      );
    }
  };

  // Remove item
  const remove = async (id) => {
    const token = getToken();
    if (token) {
      try {
        await cartAPI.removeCartItem(id);
        await fetchCart();
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // Merge guest cart with user cart after login
  const mergeCarts = async (guestItems) => {
    const token = getToken();
    if (!token) return;

    try {
      for (const item of guestItems) {
        await cartAPI.addToCart(item.id, item.qty);
      }
      await fetchCart();
      localStorage.removeItem("guestCart");
    } catch (error) {
      console.error("Error merging carts:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        increment,
        decrement,
        remove,
        fetchCart,
        mergeCarts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

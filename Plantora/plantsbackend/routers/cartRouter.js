import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';

const cartRouter = express.Router();

// All cart routes require authentication
// The auth middleware should be applied in the main server file

// Get user's cart
cartRouter.get("/", getCart);

// Add item to cart
cartRouter.post("/add", addToCart);

// Update cart item quantity
cartRouter.put("/update", updateCartItem);

// Remove specific item from cart
cartRouter.delete("/remove/:productId", removeCartItem);

// Clear entire cart
cartRouter.delete("/clear", clearCart);

export default cartRouter;
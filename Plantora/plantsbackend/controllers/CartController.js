import Cart from "../models/Cart.js";
import Product from "../models/product.js";

// Get user's cart
export async function getCart(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        let cart = await Cart.findOne({ userId: req.user.id })
            .populate('items.productId', 'name price images category isAvailable');

        if (!cart) {
            // Create empty cart if none exists
            cart = new Cart({
                userId: req.user.id,
                items: []
            });
            await cart.save();
        }

        res.json({
            success: true,
            items: cart.items,
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch cart" 
        });
    }
}

// Add item to cart
export async function addToCart(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Verify product exists and is available
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!product.isAvailable) {
            return res.status(400).json({ message: "Product is not available" });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({
                userId: req.user.id,
                items: []
            });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            // Add new item to cart
            cart.items.push({
                productId: productId,
                quantity: parseInt(quantity)
            });
        }

        await cart.save();

        // Populate the cart before returning
        cart = await Cart.findById(cart._id)
            .populate('items.productId', 'name price images category isAvailable');

        res.status(201).json({
            success: true,
            message: "Item added to cart successfully",
            cart: {
                items: cart.items,
                totalItems: cart.totalItems,
                totalPrice: cart.totalPrice
            }
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to add item to cart" 
        });
    }
}

// Update cart item quantity
export async function updateCartItem(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { productId, quantity } = req.body;

        if (!productId || quantity < 1) {
            return res.status(400).json({ 
                message: "Valid product ID and quantity (>= 1) are required" 
            });
        }

        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.items[itemIndex].quantity = parseInt(quantity);
        await cart.save();

        // Populate the cart before returning
        const updatedCart = await Cart.findById(cart._id)
            .populate('items.productId', 'name price images category isAvailable');

        res.json({
            success: true,
            message: "Cart item updated successfully",
            cart: {
                items: updatedCart.items,
                totalItems: updatedCart.totalItems,
                totalPrice: updatedCart.totalPrice
            }
        });
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update cart item" 
        });
    }
}

// Remove item from cart
export async function removeCartItem(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();

        // Populate the cart before returning
        const updatedCart = await Cart.findById(cart._id)
            .populate('items.productId', 'name price images category isAvailable');

        res.json({
            success: true,
            message: "Item removed from cart successfully",
            cart: {
                items: updatedCart.items,
                totalItems: updatedCart.totalItems,
                totalPrice: updatedCart.totalPrice
            }
        });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to remove cart item" 
        });
    }
}

// Clear entire cart
export async function clearCart(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        res.json({
            success: true,
            message: "Cart cleared successfully",
            cart: {
                items: [],
                totalItems: 0,
                totalPrice: 0
            }
        });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to clear cart" 
        });
    }
}
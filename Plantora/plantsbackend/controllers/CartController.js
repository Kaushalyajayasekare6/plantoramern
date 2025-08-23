// controllers/CartController.js
import Cart from "../models/Cart.js";

// Get user cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(await cart.populate("items.productId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) {
      item.quantity = quantity;
    } else {
      return res.status(404).json({ message: "Product not in cart" });
    }

    await cart.save();
    res.json(await cart.populate("items.productId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove product from cart
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);

    await cart.save();
    res.json(await cart.populate("items.productId"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

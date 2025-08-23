import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  next();
};

router.get("/", requireAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json(cart || { items: [] });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/add", requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const idx = cart.items.findIndex(i => i.productId.toString() === productId);
    if (idx >= 0) cart.items[idx].quantity += quantity;
    else cart.items.push({ productId, quantity });

    await cart.save();
    res.json(await cart.populate("items.productId"));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put("/update", requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) item.quantity = quantity;

    await cart.save();
    res.json(await cart.populate("items.productId"));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/remove/:productId", requireAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(await cart.populate("items.productId"));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;

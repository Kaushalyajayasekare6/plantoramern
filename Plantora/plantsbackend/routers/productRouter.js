import express from 'express';
import { createProduct, deleteProduct, getProductInfo, getProducts, updateProduct } from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const productRouter = express.Router();
productRouter.post("/", upload.array('images', 5), createProduct) // Allow up to 5 images
productRouter.get("/",getProducts)
productRouter.get("/:productId", getProductInfo) 
productRouter.delete("/:productId", deleteProduct)
productRouter.put("/:productId", updateProduct)

export default productRouter;
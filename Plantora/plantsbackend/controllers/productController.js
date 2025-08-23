import Product from "../models/product.js";

export async function createProduct(req, res) {
    try {
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);

        // Validate required fields
        if (!req.body.productId || !req.body.name || !req.body.description || !req.body.price || !req.body.category) {
            return res.status(400).json({ 
                message: "Missing required fields",
                required: ["productId", "name", "description", "price", "category"]
            });
        }

        // Check if product already exists
        const existingProduct = await Product.findOne({ productId: req.body.productId });
        if (existingProduct) {
            return res.status(400).json({ 
                message: "Product ID already exists. Please use a unique product ID." 
            });
        }

        // Parse and sanitize fields from req.body
        const productData = {
            productId: req.body.productId.trim(),
            name: req.body.name.trim(),
            description: req.body.description.trim(),
            price: parseFloat(req.body.price),
            category: req.body.category.trim(),
            isAvailable: req.body.isAvailable === "true" || req.body.isAvailable === true,
        };

        // Validate price
        if (isNaN(productData.price) || productData.price < 0) {
            return res.status(400).json({ 
                message: "Invalid price. Price must be a valid positive number." 
            });
        }

        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
            productData.images = imageUrls;
        } else {
            productData.images = ['/uploads/products/default-product.jpg'];
        }

        console.log("Creating product with data:", productData);

        const product = new Product(productData);
        const response = await product.save();

        res.status(201).json({
            message: "Product created successfully",
            product: response,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Product ID already exists. Please use a unique product ID." 
            });
        }
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Validation error", 
                errors: validationErrors 
            });
        }
        
        return res.status(500).json({ 
            message: "Failed to create product",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

export async function getProducts(req, res) {
	try {
		const products = await Product.find();
		return res.json(products);
	} catch (error) {
		console.error("Error fetching products:", error);
		return res.status(500).json({ message: "Failed to fetch products" });
	}
}

export async function deleteProduct(req, res) {
	try {
		const productId = req.params.productId;

		const result = await Product.deleteOne({
			productId: productId,
		});

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ message: "Failed to delete product" });
		return;
	}
}

export async function updateProduct(req, res) {
	const data = req.body;
	const productId = req.params.productId;
	//to prevent overwriting the productId in the request body
	data.productId = productId;

	try {
		const result = await Product.updateOne(
			{
				productId: productId,
			},
			data
		);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

		res.json({ message: "Product updated successfully" });
	} catch (error) {
		console.error("Error updating product:", error);
		res.status(500).json({ message: "Failed to update product" });
		return;
	}
}

export async function getProductInfo(req, res) {
	try {
        const productId = req.params.productId;
        const product = await Product.findOne({ productId: productId });

        if(product == null){
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.json(product);
	} catch (error) {
		console.error("Error fetching product info:", error);
		res.status(500).json({ message: "Failed to fetch product info" });
        return
	}
}
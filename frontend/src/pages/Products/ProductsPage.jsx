import React, { useState, useEffect } from "react";
import styles from "./ProductsPage.module.css";
import ProductCard from "../../components/ProductCard";
import plantImg from "../../assets/images.png"; // fallback image
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import { productAPI } from "../../services/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productAPI.getAllProducts();
        
        // Transform products to match ProductCard expectations
        const transformedProducts = data.map((product) => ({
          ...product,
          // Map backend fields to frontend expectations
          id: product._id || product.productId, // Use _id or productId as id
          title: product.name, // Map name to title
          img: product.images && product.images.length > 0 
            ? `http://localhost:5000${product.images[0]}` // Construct full URL
            : plantImg, // Fallback image
          // Keep original fields for compatibility
          name: product.name,
          image: product.images && product.images.length > 0 
            ? `http://localhost:5000${product.images[0]}` 
            : plantImg,
          rating: product.rating || 4.5, // Default rating if not provided
          price: product.price
        }));
        
        setProducts(transformedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => (p.category || "").toLowerCase() === filter.toLowerCase());

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <div className={styles.productsPage}>
        <div className={styles.filterSection}>
          <select
            className={styles.filterDropdown}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Products</option>
            <option value="natural">Natural Plants</option>
            <option value="artificial">Artificial Plants</option>
            <option value="plant accessories">Plant Accessories</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading products...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.noProducts}>No products found</div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
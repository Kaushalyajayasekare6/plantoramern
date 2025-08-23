import React from "react";
import styles from "./ProductCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

const ProductCard = ({ product, onClick }) => {
  const handleImageError = (e) => {
    e.target.src = "/img/placeholder-plant.jpg";
  };

  return (
    <div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <img 
        src={product.img} 
        alt={product.title} 
        className={styles.productImg}
        onError={handleImageError}
      />
      <div className={styles.cardContent}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.price}>LKR {product.price?.toFixed(2)}</p>
        <p className={styles.category}>{product.category}</p>
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => {
            if (i < Math.floor(product.rating || 0)) {
              return <FontAwesomeIcon key={i} icon={faStar} className={styles.star} />;
            } else if (i === Math.floor(product.rating || 0) && (product.rating || 0) % 1 >= 0.5) {
              return <FontAwesomeIcon key={i} icon={faStarHalfStroke} className={styles.star} />;
            } else {
              return <FontAwesomeIcon key={i} icon={faStar} className={`${styles.star} ${styles.emptyStar}`} />;
            }
          })}
          <span className={styles.ratingText}>({product.rating})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
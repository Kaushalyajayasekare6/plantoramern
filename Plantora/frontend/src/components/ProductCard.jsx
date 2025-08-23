import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/productoverview/${product.id}`, { state: { product } });
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <img src={product.img} alt={product.title} className={styles.productImg} />
      <div className={styles.cardContent}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.price}>{product.price}</p>
        <p className={styles.category}>{product.category}</p>
        <div className={styles.rating}>
          <FontAwesomeIcon icon={faStar} className={styles.star} />
          <FontAwesomeIcon icon={faStar} className={styles.star} />
          <FontAwesomeIcon icon={faStar} className={styles.star} />
          <FontAwesomeIcon icon={faStar} className={styles.star} />
          <FontAwesomeIcon icon={faStarHalfStroke} className={styles.star} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

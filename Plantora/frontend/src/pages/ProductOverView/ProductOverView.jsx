import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ProductInfo from '../../components/ProductInfo/ProductInfo';
import Reviews from '../../components/Reviews/Reviews';
import Footer from '../../components/Footer/Footer';
import styles from './ProductOverView.module.css';

const ProductOverView = () => {
  return (
    <div className={styles.homePage}>
      <Navbar />
      <main className={styles.mainContent}>
        <ProductInfo />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
};

export default ProductOverView;
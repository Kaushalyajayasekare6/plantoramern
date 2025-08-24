import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Left Section */}
        <div className={styles.footerLeft}>
          <h2 className={styles.footerLogo}>PLANTORA</h2>
          <p className={styles.footerTagline}>
            We help you find <br />
            your dream plant
          </p>
          <nav className={styles.socialLinks} aria-label="Social media links">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={styles.socialLink}
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.socialLink}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className={styles.socialLink}
            >
              <i className="fab fa-twitter"></i>
            </a>
          </nav>
        </div>

        {/* Right Section */}
        <div className={styles.footerRight}>
          <div className={styles.footerColumn}>
            <h3 className={styles.columnHeading}>Information</h3>
            <a href="/about" className={styles.footerLink}>About</a>
            <a href="/products" className={styles.footerLink}>Products</a>
            <a href="/blog" className={styles.footerLink}>Blog</a>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.columnHeading}>Company</h3>
            <a href="/community" className={styles.footerLink}>Community</a>
            <a href="/careers" className={styles.footerLink}>Career</a>
            <a href="/story" className={styles.footerLink}>Our Story</a>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.columnHeading}>Contact</h3>
            <a href="/getting-started" className={styles.footerLink}>Getting Started</a>
            <a href="/pricing" className={styles.footerLink}>Pricing</a>
            <a href="/resources" className={styles.footerLink}>Resources</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.footerCopyright}>
        &copy; {currentYear} PLANTORA. All Rights Reserved. Terms of Use.
      </div>
    </footer>
  );
};

export default Footer;

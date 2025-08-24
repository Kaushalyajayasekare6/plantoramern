import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <div className={styles.navbarLogo}>
          <h1>plantora</h1>
        </div>

        {/* Navigation Links */}
        <div className={styles.navbarLinks}>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/contactUs"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Right Side Icons */}
        <div className={styles.navbarIcons}>
          <NavLink to="/cart" className={styles.navIcon}>
            <i className="fas fa-shopping-cart"></i>
          </NavLink>
          <NavLink to="/login" className={styles.navIcon}>
            <i className="fas fa-user"></i>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

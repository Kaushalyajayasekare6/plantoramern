import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar-container']}>
        {/* Logo */}
        <div className={styles['navbar-logo']}>
          <h1>plantora</h1>
        </div>

        {/* Navigation Links */}
        <div className={styles['navbar-links']}>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/contactUs"
            className={({ isActive }) =>
              isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Right Side Icons */}
        <div className={styles['navbar-icons']}>
          <NavLink to="/cart" className={styles['nav-icon']}>
            <i className="fas fa-shopping-cart"></i>
          </NavLink>
          <NavLink to="/login" className={styles['nav-icon']}>
            <i className="fas fa-user"></i>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

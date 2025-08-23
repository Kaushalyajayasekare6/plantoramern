import React from "react";
import styles from "./ContactUs.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const ContactUs = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* ✅ Navbar at the top */}
      <Navbar />

      <div className={styles.contactContainer}>
        <div className={styles.contactWrapper}>
          <h2 className={styles.contactTitle}>Contact Us</h2>
          <p className={styles.contactSubtitle}>
            Any question or remarks? Just write us a message!
          </p>

          <div className={styles.contactContent}>
            {/* Left - Contact Info */}
            <div className={styles.contactInfo}>
              <div>
                <h3 className={styles.infoTitle}>Contact Information</h3>
                <p className={styles.infoSubtitle}>
                  Say something to start a live chat!
                </p>

                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <i className="fas fa-phone-alt"></i>
                    <span>+1012 3456 789</span>
                  </div>
                  <div className={styles.contactItem}>
                    <i className="fas fa-envelope"></i>
                    <span>demo@gmail.com</span>
                  </div>
                  <div className={styles.contactItem}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>123, Sri Lanka</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <form className={styles.contactForm}>
              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="First Name"
                  className={styles.formInput}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className={styles.formInput}
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className={`${styles.formInput} ${styles.fullWidth}`}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className={`${styles.formInput} ${styles.fullWidth}`}
              />
              <textarea
                placeholder="Write your message..."
                rows="4"
                className={styles.formTextarea}
              ></textarea>
              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default ContactUs;

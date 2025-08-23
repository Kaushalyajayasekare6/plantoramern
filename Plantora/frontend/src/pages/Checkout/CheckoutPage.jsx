import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CheckoutPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function CheckoutPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    name: "",
    cardNumber: "",
    expiration: "",
    cvv: ""
  });
  const [confirming, setConfirming] = useState(false);

  // Fetch cart details from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/api/cart"); // Replace with your actual API endpoint
        const items = response.data.items || [];
        setCartItems(items);

        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handlers
  const handleBack = () => navigate("/products");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    // Simple validation
    const { name, cardNumber, expiration, cvv } = paymentDetails;
    if (!name || !cardNumber || !expiration || !cvv) {
      alert("Please fill all payment details.");
      return;
    }

    setConfirming(true);
    try {
      // Call your backend to process payment
      await axios.post("/api/payment", {
        cartItems,
        total: totalPrice,
        paymentDetails
      });

      alert("Payment successful!");
      navigate("/home");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.app}>
      <Navbar />

      <div className={styles.pageContainer}>
        <main className={styles.main}>
          <section className={styles.paymentSection}>
            <h1>Your Order is Completed</h1>

            <div className={styles.paymentMethod}>
              <span>Payment Method</span>
              <div>
                <input type="radio" id="card" name="payment" defaultChecked />
                <label htmlFor="card">
                  <img
                    src="/Group 1000001772.png"
                    alt="Card Payment"
                    className={styles.paymentImg}
                  />
                </label>
                <input type="radio" id="paypal" name="payment" />
                <label htmlFor="paypal">
                  <img
                    src="/Group 1000001773.png"
                    alt="PayPal"
                    className={styles.paymentImg}
                  />
                </label>
              </div>
            </div>

            <div className={styles.paymentDetails}>
              <h2>Payment Details</h2>
              <input
                type="text"
                name="name"
                placeholder="Enter Name on Card"
                value={paymentDetails.name}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                className={styles.input}
              />
              <div className={styles.cardInfo}>
                <input
                  type="text"
                  name="expiration"
                  placeholder="Expiration"
                  value={paymentDetails.expiration}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <p className={styles.terms}>
                By clicking "Confirm Payment", I agree to the company's terms of service.
              </p>
              <div className={styles.buttons}>
                <button onClick={handleBack} className={styles.backBtn}>
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className={styles.confirmBtn}
                  disabled={confirming}
                >
                  {confirming ? "Processing..." : `Confirm Payment $${totalPrice.toFixed(2)}`}
                </button>
              </div>
            </div>
          </section>

          <aside className={styles.orderSummary}>
            <h2>Order Summary</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p>LKR {item.price.toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total Price: {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
            <div className={styles.subtotal}>
              <h3>Sub Total</h3>
              <p>{totalPrice.toFixed(2)}</p>
            </div>
          </aside>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default CheckoutPage;

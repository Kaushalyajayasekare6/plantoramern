import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { cartAPI } from "../../services/api"; // Import your API service

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
  const [error, setError] = useState(null);

  // Fetch cart details using your API service
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Please login to view your cart");
          navigate("/login");
          return;
        }

        const response = await cartAPI.getCart();
        console.log("Cart response:", response); // Debug log
        
        if (response.success && response.items) {
          setCartItems(response.items);
          
          // Calculate total from populated cart items
          const total = response.items.reduce((acc, item) => {
            // Handle populated productId structure
            const price = item.productId?.price || 0;
            const quantity = item.quantity || 0;
            return acc + (price * quantity);
          }, 0);
          
          setTotalPrice(total);
        } else {
          setCartItems([]);
          setTotalPrice(0);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError(error.message || "Failed to load cart");
        
        // If authentication error, redirect to login
        if (error.message.includes('Authentication') || error.message.includes('401')) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

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
      // You'll need to create a payment API endpoint similar to your cart API
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/payment", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems,
          total: totalPrice,
          paymentDetails
        })
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

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

  if (error) {
    return (
      <div className={styles.app}>
        <Navbar />
        <div className={styles.pageContainer}>
          <main className={styles.main}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>Error</h2>
              <p>{error}</p>
              <button onClick={() => navigate("/products")} className={styles.backBtn}>
                Go to Products
              </button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

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
                  {confirming ? "Processing..." : `Confirm Payment LKR ${totalPrice.toFixed(2)}`}
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
                <div key={item._id} className={styles.item}>
                  
                  <div>
                    <p>{item.productId?.name || 'Unknown Product'}</p>
                    <p>LKR {(item.productId?.price || 0).toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total Price: LKR {((item.productId?.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
            <div className={styles.subtotal}>
              <h3>Sub Total</h3>
              <p>LKR {totalPrice.toFixed(2)}</p>
            </div>
          </aside>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default CheckoutPage;
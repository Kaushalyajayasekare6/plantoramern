import { CartProvider, useCart } from "../../context/CartContext";
import CartTable from "../../components/Carttable";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Cart.module.css";

function CartContent() {
  const navigate = useNavigate();
  const { items, loading } = useCart();

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <div className={styles.loading}>Loading cart...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Navbar at the top */}
      <Navbar />

      <section className={styles.cartPage}>
        <div className={styles.container}>
          <CartTable />

          {items.length > 0 && (
            <div className={styles.cartActions}>
              {/* Checkout button aligned to the left */}
              <button
                className={styles.checkoutBtn}
                type="button"
                onClick={() => navigate("/checkout")}
              >
                Proceed to checkout
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}

export default function Cart() {
  return (
    <CartProvider>
      <CartContent />
    </CartProvider>
  );
}
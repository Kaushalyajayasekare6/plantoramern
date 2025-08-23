import CartItemRow from "./CartItemRow";
import { useCart } from "../context/CartContext";

export default function CartTable() {
  const { items, loading } = useCart();

  if (loading) {
    return <p className="cart-empty">Loading cart...</p>;
  }

  if (!items.length) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  return (
    <div className="cart-card">
      <table className="cart-table">
        <thead>
          <tr className="cart-head">
            <th></th>
            <th>Product Image</th>
            <th>Product title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, idx) => (
            <>
              <CartItemRow key={it.id} item={it} />
              {idx !== items.length - 1 && (
                <tr className="divider" key={`${it.id}-divider`}>
                  <td colSpan="6"></td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
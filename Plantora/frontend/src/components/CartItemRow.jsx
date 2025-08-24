import { formatLKR } from "../utils/money";
import QtyInput from "./QtyInput";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import plantImage from "../assets/plants/plant1.jpg";

export default function CartItemRow({ item }) {
  const { increment, decrement, remove } = useCart();
  const [processing, setProcessing] = useState(false);

  const handleIncrement = async () => {
    setProcessing(true);
    try {
      await increment(item.id);
    } catch (error) {
      console.error("Error incrementing item:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDecrement = async () => {
    setProcessing(true);
    try {
      await decrement(item.id);
    } catch (error) {
      console.error("Error decrementing item:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = async () => {
    setProcessing(true);
    try {
      await remove(item.id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setProcessing(false);
    }
  };

  // Handle image fallback
  const handleImageError = (e) => {
    e.target.src = plantImage;
  };

  const getImageUrl = (img) => {
    if (!img) return plantImage;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads/")) return `http://localhost:5000${img}`;
    return img;
  };

  return (
    <tr className="cart-row">
      <td className="cart-row__remove">
        <button
          type="button"
          className="remove-btn"
          title="Remove item"
          onClick={handleRemove}
          disabled={processing}
        >
          {processing ? "..." : "×"}
        </button>
      </td>

      <td className="cart-row__image">
        <img
          src={getImageUrl(item.img)}
          alt={item.title}
          onError={handleImageError}
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
      </td>

      <td className="cart-row__title">{item.title}</td>

      <td className="cart-row__price">{formatLKR(item.price)}</td>

      <td className="cart-row__qty">
        <QtyInput
          value={item.qty}
          onDecrement={handleDecrement}
          onIncrement={handleIncrement}
          disabled={processing}
        />
      </td>

      <td className="cart-row__total">{formatLKR(item.price * item.qty)}</td>
    </tr>
  );
}

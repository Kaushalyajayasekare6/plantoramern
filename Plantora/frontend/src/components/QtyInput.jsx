export default function QtyInput({ value, onDecrement, onIncrement }) {
  return (
    <div className="qty">
      <button type="button" className="qty__btn" onClick={onDecrement}>
        −
      </button>
      <span className="qty__value">{value}</span>
      <button type="button" className="qty__btn" onClick={onIncrement}>
        +
      </button>
    </div>
  );
}





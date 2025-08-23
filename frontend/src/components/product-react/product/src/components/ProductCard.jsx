function ProductCard({ img, title, price }) {
  return (
    <div className="card">
      <img src={img} alt={title} className="product-img" />
      <div className="card-content">
        <h3>{title}</h3>
        <p className="price">{price}</p>
        <div className="stars">
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star"></i>
          <i className="fa-solid fa-star-half-stroke"></i>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

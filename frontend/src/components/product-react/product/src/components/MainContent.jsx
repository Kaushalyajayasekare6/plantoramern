import ProductCard from "./ProductCard";
import plantImg from "../assets/images.png";

function MainContent() {
  return (
    <main>
      <div className="natural">
        <label htmlFor="products">.</label>
        <select id="products">
          <option value="#">Natural Plants</option>
          <option value="#">Natural Plants</option>
          <option value="#">Natural Plants</option>
        </select>
      </div>

      <div className="product">
        <ProductCard
          img={plantImg}
          title="Artificial Plants"
          price="LKR 1400.00"
        />
        <ProductCard
          img={plantImg}
          title="Artificial Plants"
          price="LKR 1400.00"
        />
        <ProductCard
          img={plantImg}
          title="Artificial Plants"
          price="LKR 1400.00"
        />
        <ProductCard
          img={plantImg}
          title="Artificial Plants"
          price="LKR 1400.00"
        />
        <ProductCard
          img={plantImg}
          title="Artificial Plants"
          price="LKR 1400.00"
        />
        <ProductCard
          img={plantImg}
          title="Artificial Plants"
          price="LKR 1400.00"
        />
        <ProductCard
          img={plantImg}
          title="Artificial Plants"
          price="LKR 1400.00"
        />
        <ProductCard
          img={plantImg}
          title="Artificial Plants"
          price="LKR 1400.00"
        />
      </div>
    </main>
  );
}

export default MainContent;

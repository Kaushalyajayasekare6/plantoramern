function Header() {
  return (
    <header>
      <h2>PLANTORA</h2>
      <ul>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Products</a>
        </li>
        <li>
          <a href="#">Contacts</a>
        </li>
      </ul>
      <div className="cart">
        <a href="#" title="cart">
          <i className="fa-solid fa-shopping-cart"></i>
        </a>
        <a href="#" title="Profile">
          <i className="fa-solid fa-user"></i>
        </a>
      </div>
    </header>
  );
}

export default Header;

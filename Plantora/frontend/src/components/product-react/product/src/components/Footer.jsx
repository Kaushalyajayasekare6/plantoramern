function Footer() {
  return (
    <footer>
      <div className="social-media">
        <h2 className="logo">GREENMIND</h2>
        <p className="tagline">
          We help you find
          <br />
          your dream plant
        </p>
        <div className="social-icons">
          <a href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
        <p className="copyright">
          2025 all Right Reserved Term of use GREENMIND
        </p>
      </div>

      <div className="footer-content">
        <div className="footer-column">
          <h3>Information</h3>
          <ul>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Product</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Company</h3>
          <ul>
            <li>
              <a href="#">Community</a>
            </li>
            <li>
              <a href="#">Career</a>
            </li>
            <li>
              <a href="#">Our story</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Contact</h3>
          <ul>
            <li>
              <a href="#">Getting Started</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">Resources</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

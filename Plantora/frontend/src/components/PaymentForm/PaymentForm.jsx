import React from 'react';
import './OrderConfirmation.css';

const PaymentForm = () => {
  return (
    <section className="payment-section">
      <h1>Your Order is Completed</h1>
      <div className="payment-method">
        <span>Payment Method</span>
        <div>
          <input type="radio" id="card" name="payment" defaultChecked />
          <label htmlFor="card">
            <img src="/Group 1000001772.png" alt="Card Payment" style={{ width: '84px', height: '33px' }} />
          </label>
          <input type="radio" id="paypal" name="payment" />
          <label htmlFor="paypal">
            <img src="/Group 1000001773.png" alt="PayPal" style={{ width: '100px', height: '40px' }} />
          </label>
        </div>
      </div>
      <div className="payment-details">
        <h2>Payment Details</h2>
        <input type="text" placeholder="Enter Name on Card" />
        <input type="text" placeholder="Card Number" />
        <div className="card-info">
          <input type="text" placeholder="Expiration" />
          <input type="text" placeholder="CVV" />
        </div>
        <p>By clicking "Confirm Payment", I agree to the company's terms of service.</p>
        <div className="buttons">
          <button className="back-btn">Back</button>
          <button className="confirm-btn">Confirm Payment $14.98</button>
        </div>
      </div>
    </section>
  );
};

export default PaymentForm;

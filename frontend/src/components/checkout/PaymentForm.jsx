import { useState } from 'react';
import { CreditCard, Banknote, ShieldCheck, Lock } from 'lucide-react';
import { CardElement } from '@stripe/react-stripe-js';

const PaymentForm = ({ paymentMethod, onPaymentMethodChange }) => {
  // Updated CardElement options for dark theme
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '16px',
        color: '#fff',
        fontFamily: '"DM Sans", sans-serif',
        '::placeholder': {
          color: '#8892aa',
        },
        iconColor: '#f0a500',
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#f87171',
        iconColor: '#f87171',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="payment-form-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .payment-form-wrap {
          font-family: 'DM Sans', sans-serif;
        }
        .payment-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .payment-section-title svg {
          color: var(--gold);
        }
        .payment-option-card {
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .payment-option-card:hover {
          border-color: rgba(240,165,0,0.5);
          transform: translateY(-2px);
        }
        .payment-option-card.selected {
          border-color: var(--gold);
          background: var(--gold-dim);
        }
        .payment-option-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .radio-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .custom-radio {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .payment-option-card.selected .custom-radio {
          border-color: var(--gold);
        }
        .custom-radio-inner {
          width: 10px;
          height: 10px;
          background: var(--gold);
          border-radius: 50%;
        }
        .payment-icon {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
        }
        .payment-icon svg {
          color: var(--gold);
        }
        .payment-details {
          line-height: 1.4;
        }
        .payment-title {
          font-weight: 700;
          font-size: 1rem;
          color: #fff;
        }
        .payment-sub {
          font-size: 0.75rem;
          color: var(--muted);
          margin-top: 2px;
        }
        .card-icons {
          display: flex;
          gap: 8px;
        }
        .card-icons img {
          height: 24px;
          object-fit: contain;
        }
        .stripe-input-wrapper {
          margin-top: 20px;
          padding: 8px 12px;
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .cod-note {
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(240,165,0,0.1);
          border-left: 3px solid var(--gold);
          border-radius: 12px;
        }
        .cod-note p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
        }
        .cod-note strong {
          color: var(--gold);
        }
        .security-notice {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 16px;
          margin-top: 20px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .security-notice svg {
          color: var(--gold);
          flex-shrink: 0;
        }
        .security-notice h4 {
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .security-notice p {
          font-size: 0.75rem;
          color: var(--muted);
          line-height: 1.4;
        }
      `}</style>

      <div>
        <div className="payment-section-title">
          <CreditCard size={22} /> Payment Method
        </div>

        <div className="payment-options">
          {/* Stripe / Credit Card Option */}
          <div
            className={`payment-option-card ${paymentMethod === 'stripe' ? 'selected' : ''}`}
            onClick={() => onPaymentMethodChange('stripe')}
          >
            <div className="payment-option-main">
              <div className="radio-group">
                <div className="custom-radio">
                  {paymentMethod === 'stripe' && <div className="custom-radio-inner"></div>}
                </div>
                <div className="payment-icon">
                  <CreditCard size={20} />
                  <div className="payment-details">
                    <div className="payment-title">Credit / Debit Card</div>
                    <div className="payment-sub">Secure payment via Stripe</div>
                  </div>
                </div>
              </div>
              <div className="card-icons">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                  alt="Visa"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                />
              </div>
            </div>

            {/* Stripe Card Input (only shown when selected) */}
            {paymentMethod === 'stripe' && (
              <div className="stripe-input-wrapper">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            )}
          </div>

          {/* Cash on Delivery Option */}
          <div
            className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
            onClick={() => onPaymentMethodChange('cod')}
          >
            <div className="payment-option-main">
              <div className="radio-group">
                <div className="custom-radio">
                  {paymentMethod === 'cod' && <div className="custom-radio-inner"></div>}
                </div>
                <div className="payment-icon">
                  <Banknote size={20} />
                  <div className="payment-details">
                    <div className="payment-title">Cash on Delivery</div>
                    <div className="payment-sub">Pay when you receive your order</div>
                  </div>
                </div>
              </div>
            </div>

            {/* COD Info Note */}
            {paymentMethod === 'cod' && (
              <div className="cod-note">
                <p>
                  <strong>Note:</strong> You'll pay in cash when your order is delivered to
                  your doorstep. Please keep the exact amount ready.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <Lock size={18} />
          <div>
            <h4>Secure Payment</h4>
            <p>
              All transactions are secured and encrypted using SSL. Your payment information
              is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
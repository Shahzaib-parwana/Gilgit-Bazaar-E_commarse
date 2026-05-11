import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Tag, AlertCircle, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

/* ─────────────────────────────────────────────
   STYLES — injected once into <head>
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --cs-navy: #0d1635;
  --cs-navy-2: #131c42;
  --cs-midnight: #0a0f1e;
  --cs-slate: #1e2a4a;
  --cs-gold: #f0a500;
  --cs-gold-lt: #fbbf24;
  --cs-gold-dim: rgba(240,165,0,0.12);
  --cs-gold-bdr: rgba(240,165,0,0.28);
  --cs-muted: #8892aa;
  --cs-border: rgba(255,255,255,0.07);
  --cs-white: #ffffff;
  --cs-green: #4ade80;
  --cs-red: #ef4444;
  --cs-spring: cubic-bezier(0.34,1.56,0.64,1);
  --cs-ease: cubic-bezier(0.25,0.46,0.45,0.94);
}

.xcs {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.xcs-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--cs-border);
}

.xcs-icon {
  width: 40px;
  height: 40px;
  background: var(--cs-gold-dim);
  border: 1px solid var(--cs-gold-bdr);
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cs-gold);
}

.xcs-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--cs-white);
  margin: 0;
}

.xcs-promo {
  position: relative;
}

.xcs-promo-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--cs-muted);
  margin-bottom: 8px;
  display: block;
}

.xcs-promo-input-wrap {
  position: relative;
  display: flex;
  gap: 8px;
}

.xcs-promo-input {
  flex: 1;
  background: var(--cs-navy);
  border: 1.5px solid var(--cs-border);
  border-radius: 11px;
  padding: 11px 16px 11px 40px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: var(--cs-white);
  transition: all 0.3s ease;
  text-transform: uppercase;
}
.xcs-promo-input::placeholder {
  color: var(--cs-muted);
  text-transform: none;
}
.xcs-promo-input:focus {
  outline: none;
  border-color: var(--cs-gold-bdr);
}

.xcs-promo-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--cs-muted);
}

.xcs-promo-btn {
  background: var(--cs-gold);
  color: #000;
  border: none;
  border-radius: 11px;
  padding: 0 20px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.xcs-promo-btn:hover:not(:disabled) {
  background: var(--cs-gold-lt);
  transform: translateY(-2px);
}
.xcs-promo-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.xcs-promo-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
}

.xcs-promo-success {
  background: rgba(74,222,128,0.12);
  border: 1px solid rgba(74,222,128,0.25);
  color: var(--cs-green);
}

.xcs-promo-error {
  background: rgba(239,68,68,0.12);
  border: 1px solid rgba(239,68,68,0.25);
  color: var(--cs-red);
}

.xcs-promo-applied {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--cs-gold-dim);
  border: 1px solid var(--cs-gold-bdr);
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 10px;
}

.xcs-promo-applied-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.xcs-promo-applied-code {
  font-weight: 700;
  color: var(--cs-gold);
  text-transform: uppercase;
}

.xcs-promo-applied-desc {
  font-size: 0.75rem;
  color: var(--cs-muted);
}

.xcs-promo-remove {
  background: none;
  border: none;
  color: var(--cs-red);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.xcs-promo-remove:hover {
  background: rgba(239,68,68,0.1);
}

.xcs-breakdown {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 0;
  border-top: 1px solid var(--cs-border);
  border-bottom: 1px solid var(--cs-border);
}

.xcs-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.xcs-line-label {
  color: var(--cs-muted);
  font-weight: 500;
}

.xcs-line-value {
  color: var(--cs-white);
  font-weight: 600;
}

.xcs-line-discount .xcs-line-value {
  color: var(--cs-green);
}

.xcs-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0 0;
}

.xcs-total-label {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--cs-white);
}

.xcs-total-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--cs-gold);
}

.xcs-tax-note {
  font-size: 0.75rem;
  color: var(--cs-muted);
  text-align: center;
  margin-top: 8px;
}

.xcs-checkout {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 15px 0;
  background: var(--cs-gold);
  color: #000;
  border: none;
  border-radius: 13px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s var(--cs-spring);
  margin-top: 8px;
}
.xcs-checkout:hover {
  background: var(--cs-gold-lt);
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(240,165,0,0.35);
}
.xcs-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.xcs-security {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--cs-border);
  border-radius: 10px;
}

.xcs-security-text {
  font-size: 0.8rem;
  color: var(--cs-muted);
  font-weight: 500;
}

.xcs-continue {
  background: none;
  border: 1.5px solid var(--cs-border);
  border-radius: 11px;
  padding: 12px 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--cs-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}
.xcs-continue:hover {
  border-color: var(--cs-gold-bdr);
  color: var(--cs-gold);
  background: var(--cs-gold-dim);
}

@media (max-width: 640px) {
  .xcs-title { font-size: 1.2rem; }
  .xcs-promo-input-wrap { flex-direction: column; }
  .xcs-promo-btn { width: 100%; padding: 12px; }
  .xcs-total-value { font-size: 1.4rem; }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('xcs-css')) {
  const el = document.createElement('style');
  el.id = 'xcs-css';
  el.textContent = CSS;
  document.head.appendChild(el);
}

const pkr = (v) =>
  'PKR ' + parseFloat(v).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const CartSummary = () => {
  const navigate = useNavigate();
  const { cart, applyCoupon, removeCoupon, loading } = useContext(CartContext);

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Get values from cart (from backend)
  const subtotal = cart?.subtotal || cart?.total_amount || 0;
  const totalItems = cart?.total_items || 0;
  const discountAmount = cart?.coupon_discount || 0;
  const appliedCoupon = cart?.coupon;
  const cartTotal = cart?.total || subtotal;

  // Free shipping logic (client-side)
  const freeShippingThreshold = 5000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 200;
  const finalTotal = cartTotal + shippingCost;
  const savings = discountAmount + (shippingCost === 0 ? 0 : (shippingCost - (subtotal >= freeShippingThreshold ? 0 : shippingCost)));
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsApplying(true);
    setPromoError('');

    try {
      await applyCoupon(promoCode);
      setPromoCode(''); // Clear input on success
    } catch (error) {
      // Error is already handled in context with toast
      if (error.response?.data?.message) {
        setPromoError(error.response.data.message);
      } else if (error.message) {
        setPromoError(error.message);
      } else {
        setPromoError('Failed to apply coupon');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromo = async () => {
    setIsApplying(true);
    try {
      await removeCoupon();
    } catch (error) {
      console.error('Error removing coupon:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { promoCode: appliedCoupon?.code } });
  };

  // Get discount display text
  const getDiscountDisplay = () => {
    if (!appliedCoupon) return '';
    if (appliedCoupon.discount_type === 'percentage') {
      return `${appliedCoupon.discount_value}% OFF`;
    }
    return `PKR ${appliedCoupon.discount_value} OFF`;
  };

  return (
    <div className="xcs">
      <div className="xcs-header">
        <div className="xcs-icon">
          <ShoppingBag size={20} />
        </div>
        <h2 className="xcs-title">Order Summary</h2>
      </div>

      <div className="xcs-promo">
        <label className="xcs-promo-label">Have a promo code?</label>
        
        {!appliedCoupon ? (
          <>
            <div className="xcs-promo-input-wrap">
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={16} className="xcs-promo-icon" />
                <input
                  type="text"
                  className="xcs-promo-input"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError(''); // Clear error on typing
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                  disabled={isApplying || loading}
                />
              </div>
              <button
                className="xcs-promo-btn"
                onClick={handleApplyPromo}
                disabled={!promoCode.trim() || isApplying || loading}
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            </div>

            {promoError && (
              <div className="xcs-promo-msg xcs-promo-error">
                <AlertCircle size={14} />
                <span>{promoError}</span>
              </div>
            )}
          </>
        ) : (
          <div className="xcs-promo-applied">
            <div className="xcs-promo-applied-left">
              <CheckCircle size={16} color="var(--cs-gold)" />
              <div>
                <div className="xcs-promo-applied-code">{appliedCoupon.code}</div>
                <div className="xcs-promo-applied-desc">
                  {getDiscountDisplay()}
                </div>
              </div>
            </div>
            <button 
              className="xcs-promo-remove" 
              onClick={handleRemovePromo}
              disabled={isApplying}
            >
              {isApplying ? 'Removing...' : 'Remove'}
            </button>
          </div>
        )}
      </div>

      <div className="xcs-breakdown">
        <div className="xcs-line">
          <span className="xcs-line-label">Subtotal ({totalItems} items)</span>
          <span className="xcs-line-value">{pkr(subtotal)}</span>
        </div>

        {discountAmount > 0 && appliedCoupon && (
          <div className="xcs-line xcs-line-discount">
            <span className="xcs-line-label">Discount ({appliedCoupon.code})</span>
            <span className="xcs-line-value">-{pkr(discountAmount)}</span>
          </div>
        )}

        <div className="xcs-line">
          <span className="xcs-line-label">Shipping</span>
          <span className="xcs-line-value">
            {shippingCost === 0 ? 'FREE' : pkr(shippingCost)}
          </span>
        </div>

        {subtotal < freeShippingThreshold && shippingCost > 0 && (
          <div className="xcs-promo-msg xcs-promo-success" style={{ marginTop: 0 }}>
            <AlertCircle size={14} />
            <span>Add {pkr(remainingForFreeShipping)} more for FREE shipping!</span>
          </div>
        )}
      </div>

      <div>
        <div className="xcs-total">
          <span className="xcs-total-label">Total</span>
          <span className="xcs-total-value">{pkr(finalTotal)}</span>
        </div>
        {savings > 0 && (
          <div className="xcs-tax-note" style={{ color: 'var(--cs-green)', fontWeight: 600 }}>
            You're saving {pkr(savings)}!
          </div>
        )}
        <div className="xcs-tax-note">Inclusive of all taxes</div>
      </div>

      <button className="xcs-checkout" onClick={handleCheckout} disabled={loading}>
        <Lock size={18} />
        <span>Proceed to Checkout</span>
        <ArrowRight size={18} />
      </button>

      <div className="xcs-security">
        <Lock size={14} className="xcs-security-icon" style={{ color: 'var(--cs-green)' }} />
        <span className="xcs-security-text">Secure checkout with SSL encryption</span>
      </div>

      <button className="xcs-continue" onClick={() => navigate('/products')}>
        Continue Shopping
      </button>
    </div>
  );
};

export default CartSummary;
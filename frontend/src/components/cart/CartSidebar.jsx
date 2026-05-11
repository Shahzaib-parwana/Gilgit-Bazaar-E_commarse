import { useContext, Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingBag, ArrowRight, Lock, Package, Loader2, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

/* ─────────────────────────────────────────────
   STYLES — injected once into <head>
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --csd-midnight: #0a0f1e;
  --csd-navy: #0d1635;
  --csd-navy-2: #131c42;
  --csd-slate: #1e2a4a;
  --csd-gold: #f0a500;
  --csd-gold-lt: #fbbf24;
  --csd-gold-dim: rgba(240,165,0,0.12);
  --csd-gold-bdr: rgba(240,165,0,0.28);
  --csd-muted: #8892aa;
  --csd-border: rgba(255,255,255,0.07);
  --csd-white: #ffffff;
  --csd-green: #4ade80;
  --csd-red: #ef4444;
  --csd-spring: cubic-bezier(0.34,1.56,0.64,1);
  --csd-ease: cubic-bezier(0.25,0.46,0.45,0.94);
}

.xcsd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10,15,30,0.75);
  backdrop-filter: blur(4px);
  z-index: 9998;
}

.xcsd {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 460px;
  background: var(--csd-navy);
  border-left: 1px solid var(--csd-border);
  box-shadow: -8px 0 40px rgba(0,0,0,0.6);
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

.xcsd-header {
  position: relative;
  padding: 24px 28px;
  border-bottom: 1px solid var(--csd-border);
  background: var(--csd-navy-2);
  flex-shrink: 0;
}

.xcsd-header-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.xcsd-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.xcsd-icon {
  width: 44px;
  height: 44px;
  background: var(--csd-gold-dim);
  border: 1px solid var(--csd-gold-bdr);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--csd-gold);
}

.xcsd-title-text h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--csd-white);
  margin: 0;
}

.xcsd-item-count {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--csd-muted);
}

.xcsd-item-count span {
  color: var(--csd-gold);
  font-weight: 700;
}

.xcsd-close {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--csd-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--csd-muted);
  cursor: pointer;
  transition: all 0.25s ease;
}
.xcsd-close:hover {
  background: var(--csd-red);
  border-color: var(--csd-red);
  color: var(--csd-white);
  transform: rotate(90deg) scale(1.08);
}

.xcsd-items {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  scrollbar-width: thin;
}

.xcsd-items-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.xcsd-item {
  display: flex;
  gap: 14px;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.25s ease;
}
.xcsd-item:hover {
  background: rgba(255,255,255,0.02);
}

.xcsd-item-img {
  width: 85px;
  height: 85px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: var(--csd-midnight);
  border: 1px solid var(--csd-border);
}
.xcsd-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s var(--csd-ease);
}
.xcsd-item:hover .xcsd-item-img img {
  transform: scale(1.08);
}

.xcsd-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.xcsd-item-name {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--csd-white);
  line-height: 1.35;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.xcsd-item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.xcsd-item-cat {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--csd-gold);
}

.xcsd-item-price {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--csd-gold);
  margin-top: 2px;
}

.xcsd-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.xcsd-qty-btn {
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--csd-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--csd-white);
}
.xcsd-qty-btn:hover:not(:disabled) {
  background: var(--csd-gold);
  border-color: var(--csd-gold);
  color: #000;
}
.xcsd-qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.xcsd-remove-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  color: var(--csd-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
}
.xcsd-remove-btn:hover:not(:disabled) {
  color: var(--csd-red);
  background: rgba(239,68,68,0.1);
}
.xcsd-remove-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.xcsd-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px 28px;
}

.xcsd-empty-icon {
  width: 100px;
  height: 100px;
  background: var(--csd-navy-2);
  border: 1px solid var(--csd-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.xcsd-empty h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--csd-white);
  margin: 0 0 8px 0;
}

.xcsd-empty p {
  color: var(--csd-muted);
  font-size: 0.9rem;
}

.xcsd-footer {
  position: relative;
  padding: 24px 28px;
  background: var(--csd-navy-2);
  border-top: 1px solid var(--csd-border);
  flex-shrink: 0;
}

.xcsd-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.xcsd-summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.xcsd-summary-label {
  color: var(--csd-muted);
  font-weight: 500;
}

.xcsd-summary-value {
  color: var(--csd-white);
  font-weight: 600;
}

.xcsd-summary-shipping {
  color: var(--csd-green);
}

.xcsd-summary-divider {
  height: 1px;
  background: var(--csd-border);
  margin: 8px 0;
}

.xcsd-summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
}

.xcsd-summary-total .xcsd-summary-label {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--csd-white);
}

.xcsd-summary-total .xcsd-summary-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--csd-gold);
}

.xcsd-shipping-progress {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--csd-border);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 16px;
}

.xcsd-progress-text {
  font-size: 0.78rem;
  color: var(--csd-muted);
  margin-bottom: 8px;
}

.xcsd-progress-bar {
  height: 6px;
  background: var(--csd-slate);
  border-radius: 10px;
  overflow: hidden;
}

.xcsd-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--csd-gold) 0%, var(--csd-gold-lt) 100%);
  border-radius: 10px;
  transition: width 0.5s var(--csd-ease);
}

.xcsd-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.xcsd-btn {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s var(--csd-spring);
}

.xcsd-btn-primary {
  background: var(--csd-gold);
  color: #000;
}
.xcsd-btn-primary:hover:not(:disabled) {
  background: var(--csd-gold-lt);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(240,165,0,0.35);
}
.xcsd-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.xcsd-btn-secondary {
  background: transparent;
  color: var(--csd-muted);
  border: 1.5px solid var(--csd-border);
}
.xcsd-btn-secondary:hover {
  background: var(--csd-gold-dim);
  border-color: var(--csd-gold);
  color: var(--csd-gold);
}

.xcsd-security {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  padding: 10px;
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.18);
  border-radius: 8px;
}

.xcsd-security span {
  font-size: 0.75rem;
  color: var(--csd-green);
  font-weight: 600;
}

@media (max-width: 640px) {
  .xcsd { max-width: 100%; }
  .xcsd-header { padding: 20px; }
  .xcsd-item { padding: 14px 20px; }
  .xcsd-item-img { width: 75px; height: 75px; }
  .xcsd-footer { padding: 20px; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
`;

if (typeof document !== 'undefined' && !document.getElementById('xcsd-css')) {
  const el = document.createElement('style');
  el.id = 'xcsd-css';
  el.textContent = CSS;
  document.head.appendChild(el);
}

const pkr = (v) =>
  'PKR ' + parseFloat(v).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, loading } = useContext(CartContext);
  const [updatingItems, setUpdatingItems] = useState({});

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative" style={{ zIndex: 9998 }}>
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--csd-gold)' }} />
        </div>
      </Dialog>
    );
  }

  const cartItems = cart?.items || [];
  const subtotal = cart?.total_amount || 0;
  const freeShippingThreshold = 5000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 200;
  const total = subtotal + shippingCost;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const needMore = freeShippingThreshold - subtotal;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        open={isOpen} 
        onClose={onClose} 
        className="relative" 
        style={{ zIndex: 9998 }}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="xcsd-overlay" />
        </Transition.Child>

        {/* Sidebar */}
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 9999 }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-350"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto">
                  <div className="xcsd">
                    {/* Header */}
                    <div className="xcsd-header">
                      <div className="xcsd-header-content">
                        <div className="xcsd-title-wrap">
                          <div className="xcsd-icon">
                            <ShoppingBag size={22} />
                          </div>
                          <div className="xcsd-title-text">
                            <h2>Shopping Cart</h2>
                            <div className="xcsd-item-count">
                              <span>{cart?.total_items || 0}</span> items
                            </div>
                          </div>
                        </div>
                        <button onClick={onClose} className="xcsd-close">
                          <X size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="xcsd-items">
                      {cartItems.length > 0 ? (
                        <div className="xcsd-items-list">
                          {cartItems.map((item) => (
                            <div key={item.id} className="xcsd-item">
                              <div className="xcsd-item-img">
                                <img
                                  src={item.image || 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400'}
                                  alt={item.name}
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400';
                                  }}
                                />
                              </div>
                              <div className="xcsd-item-info">
                                <h3 className="xcsd-item-name">{item.name || 'Product'}</h3>
                                <div className="xcsd-item-meta">
                                  {item.category_name && (
                                    <span className="xcsd-item-cat">{item.category_name}</span>
                                  )}
                                </div>
                                <div className="xcsd-item-price">
                                  {pkr(item.price * item.quantity)}
                                </div>
                                
                                <div className="xcsd-item-actions">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                    disabled={updatingItems[item.id]}
                                    className="xcsd-qty-btn"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span style={{ color: 'white', fontSize: '0.85rem', minWidth: '30px', textAlign: 'center' }}>
                                    {updatingItems[item.id] ? <Loader2 size={12} className="animate-spin" /> : item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                    disabled={updatingItems[item.id]}
                                    className="xcsd-qty-btn"
                                  >
                                    <Plus size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={updatingItems[item.id]}
                                    className="xcsd-remove-btn"
                                  >
                                    <Trash2 size={12} /> Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="xcsd-empty">
                          <div className="xcsd-empty-icon">
                            <Package size={44} />
                          </div>
                          <h3>Your Cart is Empty</h3>
                          <p>Add some beautiful products to get started</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="xcsd-footer">
                        <div className="xcsd-footer-content">
                          {subtotal < freeShippingThreshold && (
                            <div className="xcsd-shipping-progress">
                              <div className="xcsd-progress-text">
                                Add <span style={{ color: 'var(--csd-gold)', fontWeight: 700 }}>{pkr(needMore)}</span> more for FREE shipping!
                              </div>
                              <div className="xcsd-progress-bar">
                                <div className="xcsd-progress-fill" style={{ width: `${shippingProgress}%` }} />
                              </div>
                            </div>
                          )}

                          <div className="xcsd-summary">
                            <div className="xcsd-summary-line">
                              <span className="xcsd-summary-label">Subtotal</span>
                              <span className="xcsd-summary-value">{pkr(subtotal)}</span>
                            </div>
                            <div className="xcsd-summary-line">
                              <span className="xcsd-summary-label">Shipping</span>
                              <span className={`xcsd-summary-value ${shippingCost === 0 ? 'xcsd-summary-shipping' : ''}`}>
                                {shippingCost === 0 ? 'FREE' : pkr(shippingCost)}
                              </span>
                            </div>
                            <div className="xcsd-summary-divider" />
                            <div className="xcsd-summary-total">
                              <span className="xcsd-summary-label">Total</span>
                              <span className="xcsd-summary-value">{pkr(total)}</span>
                            </div>
                          </div>

                          <div className="xcsd-buttons">
                            <button onClick={handleCheckout} className="xcsd-btn xcsd-btn-primary">
                              <Lock size={18} />
                              <span>Proceed to Checkout</span>
                              <ArrowRight size={18} />
                            </button>
                            <button onClick={handleViewCart} className="xcsd-btn xcsd-btn-secondary">
                              <span>View Full Cart</span>
                            </button>
                          </div>

                          <div className="xcsd-security">
                            <Lock size={13} />
                            <span>Secure Checkout</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartSidebar;
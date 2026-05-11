import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { cartService } from '../../services/cartService';
import toast from 'react-hot-toast';
import { ShieldCheck, CreditCard, Truck, CalendarDays, Tag, CheckCircle, Package, Clock, Receipt, Download, ShoppingBag } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Checkout Form Content
const CheckoutFormContent = () => {
  const { cart, clearCart, refreshCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [settings, setSettings] = useState({
    shipping_cost: 300,
    tax_percentage: 0,
    tax_name: 'GST'
  });
  
  const [formData, setFormData] = useState({
    shipping_name: user ? `${user.first_name} ${user.last_name}` : '',
    shipping_email: user?.email || '',
    shipping_phone: user?.phone || '',
    shipping_address: user?.address || '',
    shipping_city: user?.city || '',
    shipping_state: user?.state || '',
    shipping_zip: user?.zip_code || '',
    notes: '',
  });

  // Fetch store settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await cartService.getStoreSettings();
        setSettings({
          shipping_cost: parseFloat(data.shipping_cost) || 300,
          tax_percentage: parseFloat(data.tax_percentage) || 0,
          tax_name: data.tax_name || 'GST'
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotals = () => {
    const toNumber = (value) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') return parseFloat(value) || 0;
      return 0;
    };

    const subtotal = toNumber(cart?.subtotal);
    const couponDiscount = toNumber(cart?.coupon_discount);
    const totalAfterDiscount = subtotal - couponDiscount;
    
    const taxAmount = (totalAfterDiscount * settings.tax_percentage) / 100;
    const grandTotal = totalAfterDiscount + settings.shipping_cost + taxAmount;
    
    return { 
      subtotal, 
      couponDiscount,
      shippingCost: settings.shipping_cost,
      taxPercentage: settings.tax_percentage,
      taxAmount,
      taxName: settings.tax_name,
      grandTotal
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart || cart.total_items === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!formData.shipping_name || !formData.shipping_email || !formData.shipping_phone || 
        !formData.shipping_address || !formData.shipping_city || !formData.shipping_state) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    const loadingToast = toast.loading('Processing your order...');

    try {
      const { subtotal, shippingCost, taxAmount, grandTotal } = calculateTotals();

      // Prepare items array matching backend OrderItemSerializer
      const items = cart.items.map((item) => ({
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        quantity: item.quantity,
        price: parseFloat(item.price) || 0,
      }));

      // Prepare order data matching backend OrderCreateSerializer
      const orderData = {
        payment_method: paymentMethod,
        shipping_name: formData.shipping_name,
        shipping_email: formData.shipping_email,
        shipping_phone: formData.shipping_phone,
        shipping_address: formData.shipping_address,
        shipping_city: formData.shipping_city,
        shipping_state: formData.shipping_state,
        shipping_zip: formData.shipping_zip || '',
        subtotal: subtotal,
        shipping_cost: shippingCost,
        tax: taxAmount,
        total: grandTotal,
        notes: formData.notes || '',
        items: items,
      };

      console.log('Submitting order with data:', orderData);

      // Create order
      const order = await orderService.createOrder(orderData);

      console.log('Order created successfully:', order);

      if (!order || !order.id) {
        throw new Error('Order creation failed - no order ID returned');
      }

      if (paymentMethod === 'stripe') {
        try {
          const { clientSecret } = await paymentService.createStripeIntent(order.id);
          
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: formData.shipping_name,
                email: formData.shipping_email,
              },
            },
          });

          if (error) {
            throw new Error(error.message);
          }

          if (paymentIntent.status === 'succeeded') {
            // Update order to paid
            await orderService.updateOrderStatus(order.id, 'paid');
            
            // Clear cart
            await clearCart();
            await refreshCart();
            
            toast.dismiss(loadingToast);
            toast.success('Payment successful!');
            
            // Navigate to order success page with order ID
            navigate(`/order-success/${order.id}`);
            setLoading(false);
          } else {
            throw new Error('Payment failed - unexpected status');
          }
        } catch (stripeError) {
          await orderService.updateOrderStatus(order.id, 'cancelled');
          throw stripeError;
        }
      } else if (paymentMethod === 'cod') {
        // For COD, order status remains 'pending'
        toast.dismiss(loadingToast);
        toast.success('Order placed successfully!');
        
        // Clear cart
        await clearCart();
        await refreshCart();
        
        // Navigate to order success page with order ID
        navigate(`/order-success/${order.id}`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error details:', error);
      
      toast.dismiss(loadingToast);
      
      let errorMessage = 'Checkout failed. Please try again.';
      
      if (error.response?.data) {
        const backendError = error.response.data;
        if (typeof backendError === 'string') {
          errorMessage = backendError;
        } else if (backendError.error) {
          errorMessage = backendError.error;
        } else if (backendError.message) {
          errorMessage = backendError.message;
        } else if (backendError.detail) {
          errorMessage = backendError.detail;
        } else {
          errorMessage = JSON.stringify(backendError);
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const { 
    subtotal, 
    couponDiscount,
    shippingCost,
    taxPercentage,
    taxAmount,
    taxName,
    grandTotal
  } = calculateTotals();

  return (
    <div className="checkout-wrap">
      <style>{`
        .checkout-wrap {
          background: #0a0f1e;
          padding: 100px 0 80px;
          min-height: 100vh;
        }
        .checkout-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 32px;
        }
        .form-card, .summary-card, .payment-card {
          background: #131c42;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 28px;
        }
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .card-title svg {
          color: #f0a500;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 8px;
          color: #fff;
        }
        .form-group input, .form-group textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-size: 0.9rem;
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #f0a500;
        }
        .payment-option {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .payment-option.selected {
          border-color: #f0a500;
          background: rgba(240,165,0,0.12);
        }
        .radio-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-weight: 600;
          color: #fff;
        }
        .radio-label input {
          width: 18px;
          height: 18px;
          accent-color: #f0a500;
        }
        .stripe-element-wrapper {
          margin-top: 16px;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
        }
        .summary-items {
          margin-bottom: 20px;
          max-height: 300px;
          overflow-y: auto;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 0.85rem;
        }
        .summary-item-name {
          color: rgba(255,255,255,0.8);
        }
        .summary-item-price {
          color: #f0a500;
          font-weight: 500;
        }
        .summary-totals {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 16px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 0.9rem;
          color: #8892aa;
        }
        .discount-row {
          color: #4ade80;
        }
        .tax-row {
          color: #f0a500;
        }
        .totals-row.total {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 12px;
          margin-top: 8px;
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
        }
        .totals-row.total .amount {
          color: #f0a500;
          font-size: 1.4rem;
        }
        .coupon-badge {
          background: rgba(240,165,0,0.12);
          border: 1px solid rgba(240,165,0,0.3);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
        }
        .coupon-badge-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .coupon-code {
          color: #f0a500;
          font-weight: 700;
          text-transform: uppercase;
        }
        .coupon-savings {
          color: #4ade80;
          font-weight: 600;
        }
        .btn-submit {
          width: 100%;
          background: #f0a500;
          color: #000;
          border: none;
          padding: 14px 24px;
          border-radius: 40px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 24px;
          transition: all 0.3s ease;
        }
        .btn-submit:hover:not(:disabled) {
          background: #fbbf24;
          transform: translateY(-2px);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; gap: 0; }
        }
      `}</style>

      <div className="checkout-container">
        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            {/* Left Column - Shipping & Payment */}
            <div>
              <div className="form-card" style={{ marginBottom: '32px' }}>
                <div className="card-title">
                  <Truck size={24} /> Shipping Information
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="shipping_name"
                    value={formData.shipping_name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="shipping_email"
                      value={formData.shipping_email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="shipping_phone"
                      value={formData.shipping_phone}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="shipping_state"
                      value={formData.shipping_state}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="shipping_zip"
                      value={formData.shipping_zip}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Any special instructions?"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="payment-card">
                <div className="card-title">
                  <CreditCard size={24} /> Payment Method
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'stripe' ? 'selected' : ''}`}
                  onClick={() => !loading && setPaymentMethod('stripe')}
                >
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      disabled={loading}
                    />
                    Credit / Debit Card
                  </label>
                  {paymentMethod === 'stripe' && (
                    <div className="stripe-element-wrapper">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#fff',
                              '::placeholder': { color: '#8892aa' },
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => !loading && setPaymentMethod('cod')}
                >
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      disabled={loading}
                    />
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="summary-card">
                <div className="card-title">
                  <CalendarDays size={24} /> Order Summary
                </div>

                {couponDiscount > 0 && (
                  <div className="coupon-badge">
                    <div className="coupon-badge-left">
                      <Tag size={16} color="#f0a500" />
                      <div>
                        <div className="coupon-code">Coupon Applied</div>
                        <div style={{ fontSize: '0.7rem', color: '#8892aa' }}>
                          Discount Applied
                        </div>
                      </div>
                    </div>
                    <div className="coupon-savings">-PKR {couponDiscount.toFixed(2)}</div>
                  </div>
                )}

                <div className="summary-items">
                  {cart?.items?.map((item) => (
                    <div key={item.id} className="summary-item">
                      <span className="summary-item-name">
                        {item.product?.name} <span style={{ color: '#8892aa' }}>x {item.quantity}</span>
                      </span>
                      <span className="summary-item-price">
                        PKR {(parseFloat(item.total_price) || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="totals-row">
                    <span>Subtotal</span>
                    <span>PKR {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {couponDiscount > 0 && (
                    <div className="totals-row discount-row">
                      <span>Discount</span>
                      <span>-PKR {couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="totals-row">
                    <span>Subtotal after discount</span>
                    <span>PKR {(subtotal - couponDiscount).toFixed(2)}</span>
                  </div>
                  
                  <div className="totals-row">
                    <span>Shipping</span>
                    <span>PKR {shippingCost.toFixed(2)}</span>
                  </div>
                  
                  {taxPercentage > 0 && (
                    <div className="totals-row tax-row">
                      <span>{taxName} ({taxPercentage}%)</span>
                      <span>PKR {taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="totals-row total">
                    <span>Total</span>
                    <span className="amount">PKR {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || (paymentMethod === 'stripe' && !stripe)}
                  className="btn-submit"
                >
                  {loading ? (
                    <>
                      <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    paymentMethod === 'cod' ? `Place Order (COD) - PKR ${grandTotal.toFixed(2)}` : `Pay with Card - PKR ${grandTotal.toFixed(2)}`
                  )}
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.7rem', color: '#8892aa' }}>
                  <ShieldCheck size={14} style={{ display: 'inline', marginRight: '8px' }} />
                  Secure payment encrypted
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const CheckoutForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent />
    </Elements>
  );
};

export default CheckoutForm;
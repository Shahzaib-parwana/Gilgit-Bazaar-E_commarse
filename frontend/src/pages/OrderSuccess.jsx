import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag, Truck, Clock } from 'lucide-react';
import { orderService } from '../services/orderService';
import Loader from '../components/common/Loader';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!order) return <div className="text-center py-12 text-white">Order not found</div>;

  return (
    <div className="order-success-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .order-success-wrap {
          background: var(--midnight);
          min-height: 100vh;
          padding: 100px 0 80px;
          font-family: 'DM Sans', sans-serif;
        }

        :root {
          --midnight: #0a0f1e;
          --navy: #0d1635;
          --navy-2: #131c42;
          --gold: #f0a500;
          --gold-light: #fbbf24;
          --gold-dim: rgba(240,165,0,0.12);
          --slate: #1e2a4a;
          --muted: #8892aa;
          --white: #ffffff;
        }

        .success-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .success-header {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeUp 0.5s ease forwards;
        }
        .success-icon {
          width: 80px;
          height: 80px;
          background: var(--gold-dim);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .success-icon svg {
          color: var(--gold);
          width: 44px;
          height: 44px;
        }
        .success-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
        }
        .success-header p {
          color: var(--muted);
          font-size: 0.9rem;
        }

        .order-card {
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 32px;
          animation: fadeUp 0.6s ease forwards;
        }

        .order-section {
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 24px;
          margin-bottom: 24px;
        }
        .order-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-title svg {
          color: var(--gold);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .info-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
        }
        .info-value {
          font-weight: 600;
          color: #fff;
          font-size: 0.9rem;
        }

        /* Items list */
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .order-item {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .item-image {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          overflow: hidden;
          flex-shrink: 0;
        }
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-details {
          flex: 1;
        }
        .item-name {
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }
        .item-quantity {
          font-size: 0.75rem;
          color: var(--muted);
        }
        .item-price {
          font-weight: 700;
          color: var(--gold);
        }

        /* Totals */
        .totals {
          background: rgba(0,0,0,0.2);
          border-radius: 20px;
          padding: 20px;
          margin-top: 16px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
        }
        .total-row.grand {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 12px;
          margin-top: 8px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }
        .total-row.grand .amount {
          color: var(--gold);
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
        }

        .shipping-address {
          background: rgba(0,0,0,0.2);
          border-radius: 20px;
          padding: 20px;
          margin-top: 16px;
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
          flex-wrap: wrap;
        }
        .btn-primary, .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.25s;
        }
        .btn-primary {
          background: var(--gold);
          color: #000;
        }
        .btn-primary:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(240,165,0,0.3);
        }
        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
        }
        .btn-secondary:hover {
          border-color: var(--gold);
          color: var(--gold);
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .order-success-wrap { padding: 80px 0 60px; }
          .order-card { padding: 20px; }
          .info-grid { grid-template-columns: 1fr; gap: 12px; }
          .action-buttons { flex-direction: column; }
          .btn-primary, .btn-secondary { justify-content: center; }
        }
      `}</style>

      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">
            <CheckCircle />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your order. A confirmation email has been sent to <strong style={{ color: 'var(--gold)' }}>{order.shipping_email}</strong></p>
        </div>

        <div className="order-card">
          {/* Order Details Section */}
          <div className="order-section">
            <div className="section-title">
              <Package size={20} /> Order Details
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Order Number</span>
                <span className="info-value">{order.order_number}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Order Date</span>
                <span className="info-value">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Payment Method</span>
                <span className="info-value capitalize">{order.payment_method}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value capitalize" style={{ color: '#22c55e' }}>{order.status}</span>
              </div>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="order-section">
            <div className="section-title">
              <ShoppingBag size={20} /> Items Ordered
            </div>
            <div className="items-list">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.product.primary_image || 'https://via.placeholder.com/80'} alt={item.product.name} />
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.product.name}</div>
                    <div className="item-quantity">Quantity: {item.quantity}</div>
                  </div>
                  <div className="item-price">PKR {parseFloat(item.total_price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="order-section">
            <div className="section-title">
              <Truck size={20} /> Payment Summary
            </div>
            <div className="totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>PKR {parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>PKR {parseFloat(order.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (5%)</span>
                <span>PKR {parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <div className="total-row grand">
                <span>Total</span>
                <span className="amount">PKR {parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="order-section">
            <div className="section-title">
              <Clock size={20} /> Shipping Information
            </div>
            <div className="shipping-address">
              <strong>{order.shipping_name}</strong><br />
              {order.shipping_address}<br />
              {order.shipping_city}, {order.shipping_state} {order.shipping_zip}<br />
              {order.shipping_phone}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/orders" className="btn-primary">
            <Package size={18} /> View All Orders
          </Link>
          <Link to="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
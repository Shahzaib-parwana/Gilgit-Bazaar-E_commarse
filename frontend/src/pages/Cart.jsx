import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loader from '../components/common/Loader';

const Cart = () => {
  const { cart, loading, clearCart, refreshCart } = useContext(CartContext);

  // Refresh cart data when component mounts to ensure we have latest product info
  useEffect(() => {
    refreshCart();
  }, []);

  if (loading) return <Loader />;

  // Empty cart state
  if (!cart || cart.total_items === 0) {
    return (
      <div className="cart-wrap">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

          .cart-wrap {
            background: var(--midnight);
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DM Sans', sans-serif;
            padding-top: 80px;
          }
          :root {
            --midnight: #0a0f1e;
            --navy: #0d1635;
            --navy-2: #131c42;
            --gold: #f0a500;
            --gold-light: #fbbf24;
            --gold-dim: rgba(240,165,0,0.12);
            --muted: #8892aa;
            --white: #ffffff;
          }
          .empty-state {
            text-align: center;
            animation: fadeUp 0.7s ease forwards;
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .empty-icon {
            background: var(--navy-2);
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            border: 1px solid rgba(240,165,0,0.2);
          }
          .empty-icon svg {
            color: var(--gold);
            width: 48px;
            height: 48px;
          }
          .empty-state h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 12px;
          }
          .empty-state p {
            color: var(--muted);
            margin-bottom: 28px;
          }
          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--gold);
            color: #000;
            padding: 12px 28px;
            border-radius: 40px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.25s;
          }
          .btn-primary:hover {
            background: var(--gold-light);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(240,165,0,0.3);
          }
        `}</style>
        <div className="empty-state">
          <div className="empty-icon">
            <ShoppingBag />
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Add some beautiful products to get started</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Log cart items to debug
  console.log('Cart items in Cart page:', cart.items);

  return (
    <div className="cart-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cart-wrap {
          background: var(--midnight);
          font-family: 'DM Sans', sans-serif;
          padding: 100px 0 80px;
          min-height: 100vh;
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

        .cart-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* Header */
        .cart-header {
          margin-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 20px;
        }
        .cart-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
        }
        .cart-header h1 span {
          color: var(--gold);
        }

        /* Two column layout */
        .cart-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 32px;
        }

        /* Cart items card */
        .cart-items-card {
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          overflow: hidden;
          animation: fadeUp 0.5s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .card-header h2 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #fff;
        }
        .clear-cart-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
          padding: 8px 12px;
          border-radius: 8px;
        }
        .clear-cart-btn:hover {
          color: #f87171;
          background: rgba(239,68,68,0.1);
        }

        .items-divider {
          padding: 0;
        }
        .items-divider > * {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .items-divider > *:last-child {
          border-bottom: none;
        }

        /* Summary card styling */
        .summary-card {
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 24px;
          position: sticky;
          top: 100px;
          animation: fadeUp 0.5s ease forwards 0.1s;
        }

        /* Additional responsive fixes */
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr; }
          .cart-wrap { padding-top: 80px; }
          .summary-card { position: static; margin-top: 20px; }
        }
        @media (max-width: 640px) {
          .cart-container { padding: 0 20px; }
          .card-header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .cart-header h1 { font-size: 2rem; }
        }

        /* Loading state for items */
        .items-loading {
          padding: 40px;
          text-align: center;
          color: var(--muted);
        }
      `}</style>

      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping <span>Cart</span></h1>
        </div>

        <div className="cart-grid">
          {/* Cart Items Section */}
          <div className="cart-items-card">
            <div className="card-header">
              <h2>Cart Items ({cart.total_items})</h2>
              <button onClick={clearCart} className="clear-cart-btn">
                <Trash2 size={14} />
                Clear Cart
              </button>
            </div>
            <div className="items-divider">
              {cart.items && cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))
              ) : (
                <div className="items-loading">No items in cart</div>
              )}
            </div>
          </div>

          {/* Cart Summary Section */}
          <div className="summary-card">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
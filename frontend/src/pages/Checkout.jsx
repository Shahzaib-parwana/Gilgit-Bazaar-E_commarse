import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { ShoppingBag } from 'lucide-react';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login?redirect=/checkout" />;
  }

  // Redirect to cart if cart is empty
  if (!cart || cart.total_items === 0) {
    return <Navigate to="/cart" />;
  }

  return (
    <div className="checkout-page-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .checkout-page-wrap {
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

        .checkout-page-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .checkout-page-header {
          margin-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 20px;
          animation: fadeUp 0.5s ease forwards;
        }

        .checkout-page-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
        }

        .checkout-page-header h1 span {
          color: var(--gold);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .checkout-page-wrap { padding-top: 80px; }
          .checkout-page-container { padding: 0 20px; }
          .checkout-page-header h1 { font-size: 2rem; }
        }
      `}</style>

      <div className="checkout-page-container">
        <div className="checkout-page-header">
          <h1>Secure <span>Checkout</span></h1>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
};

export default Checkout;
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

/* ─────────────────────────────────────────────
   STYLES — injected once into <head>
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --ci-navy: #0d1635;
  --ci-navy-2: #131c42;
  --ci-midnight: #0a0f1e;
  --ci-slate: #1e2a4a;
  --ci-gold: #f0a500;
  --ci-gold-lt: #fbbf24;
  --ci-gold-dim: rgba(240,165,0,0.12);
  --ci-gold-bdr: rgba(240,165,0,0.28);
  --ci-muted: #8892aa;
  --ci-border: rgba(255,255,255,0.07);
  --ci-white: #ffffff;
  --ci-red: #ef4444;
  --ci-red-dim: rgba(239,68,68,0.12);
  --ci-spring: cubic-bezier(0.34,1.56,0.64,1);
  --ci-ease: cubic-bezier(0.25,0.46,0.45,0.94);
}

.xci {
  position: relative;
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 18px;
  padding: 20px 24px;
  background: transparent;
  transition: background 0.3s ease;
  border-bottom: 1px solid var(--ci-border);
}
.xci:hover {
  background: rgba(255,255,255,0.02);
}

.xci-img-wrap {
  position: relative;
  aspect-ratio: 1;
  border-radius: 14px;
  overflow: hidden;
  background: var(--ci-navy);
  border: 1px solid var(--ci-border);
  flex-shrink: 0;
}
.xci-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s var(--ci-ease);
}
.xci:hover .xci-img {
  transform: scale(1.08);
}

.xci-img-link {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(10,15,30,0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ci-muted);
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.25s ease, transform 0.3s var(--ci-spring);
  z-index: 2;
  cursor: pointer;
}
.xci:hover .xci-img-link {
  opacity: 1;
  transform: scale(1);
}
.xci-img-link:hover {
  background: var(--ci-gold);
  color: #000;
  border-color: var(--ci-gold);
}

.xci-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.xci-name {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ci-white);
  line-height: 1.4;
  margin: 0;
  transition: color 0.25s ease;
}
.xci:hover .xci-name {
  color: var(--ci-gold-lt);
}

.xci-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.xci-cat {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ci-gold);
}

.xci-price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 4px;
}

.xci-price {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ci-white);
}

.xci-unit-price {
  font-size: 0.72rem;
  color: var(--ci-muted);
  margin-top: 2px;
}

.xci-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  min-width: 140px;
}

.xci-remove {
  background: none;
  border: none;
  color: var(--ci-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  transition: all 0.25s ease;
}
.xci-remove:hover:not(:disabled) {
  color: var(--ci-red);
  background: var(--ci-red-dim);
}
.xci-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.xci-qty-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.xci-qty-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--ci-muted);
  text-transform: uppercase;
}

.xci-qty {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--ci-navy);
  border: 1.5px solid var(--ci-border);
  border-radius: 12px;
  overflow: hidden;
}

.xci-qty-btn {
  width: 34px;
  height: 34px;
  background: transparent;
  border: none;
  color: var(--ci-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.xci-qty-btn:hover:not(:disabled) {
  color: var(--ci-gold);
}
.xci-qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.xci-qty-val {
  min-width: 45px;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--ci-white);
}

.xci-subtotal {
  text-align: right;
}

.xci-subtotal-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--ci-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.xci-subtotal-val {
  font-family: 'Playfair Display', serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--ci-gold);
}

@media (max-width: 640px) {
  .xci {
    grid-template-columns: 90px 1fr;
    gap: 14px;
    padding: 16px 18px;
  }
  
  .xci-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-width: auto;
  }
  
  .xci-qty-wrap {
    align-items: flex-start;
  }
  
  .xci-subtotal {
    text-align: left;
  }
  
  .xci-name {
    font-size: 0.95rem;
  }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('xci-css')) {
  const el = document.createElement('style');
  el.id = 'xci-css';
  el.textContent = CSS;
  document.head.appendChild(el);
}

const pkr = (v) =>
  'PKR ' + parseFloat(v).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useContext(CartContext);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  // Debug log to see what item data we're receiving
  console.log('CartItem received:', item);

  if (!item) {
    console.error('CartItem received null or undefined item');
    return <div className="xci">Error: Item data missing</div>;
  }

  const handleIncrement = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      await updateCartItem(item.id, item.quantity + 1);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDecrement = async () => {
    if (updating) return;
    if (item.quantity <= 1) return;
    setUpdating(true);
    try {
      await updateCartItem(item.id, item.quantity - 1);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (removing) return;
    setRemoving(true);
    try {
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setRemoving(false);
    }
  };

  const subtotal = parseFloat(item.price) * item.quantity;
  const productSlug = item.slug || `product-${item.product_id}`;
  const productImage = item.image || 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400';
  const productName = item.name || 'Product Name Unavailable';
  const productCategory = item.category_name || '';
  const productPrice = item.price || 0;

  return (
    <div className="xci">
      {/* Image */}
      <div className="xci-img-wrap">
        <img
          src={productImage}
          alt={productName}
          className="xci-img"
          loading="lazy"
          onError={(e) => {
            console.error('Image failed to load:', productImage);
            e.target.src = 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400';
          }}
        />
        <Link to={`/products/${productSlug}`} className="xci-img-link" title="View product">
          <ExternalLink size={13} strokeWidth={2} />
        </Link>
      </div>

      {/* Info */}
      <div className="xci-info">
        <h3 className="xci-name">{productName}</h3>
        
        {productCategory && (
          <div className="xci-meta">
            <span className="xci-cat">{productCategory}</span>
          </div>
        )}

        <div className="xci-price-row">
          <span className="xci-price">{pkr(productPrice)}</span>
        </div>

        {item.quantity > 1 && (
          <div className="xci-unit-price">
            {pkr(productPrice)} × {item.quantity}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="xci-actions">
        <button 
          onClick={handleRemove} 
          className="xci-remove" 
          disabled={removing}
        >
          <Trash2 size={14} />
          <span>{removing ? '...' : 'Remove'}</span>
        </button>

        <div className="xci-qty-wrap">
          <div className="xci-qty-label">Quantity</div>
          <div className="xci-qty">
            <button
              className="xci-qty-btn"
              onClick={handleDecrement}
              disabled={item.quantity <= 1 || updating}
            >
              <Minus size={14} />
            </button>
            <div className="xci-qty-val">
              {updating ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : item.quantity}
            </div>
            <button
              className="xci-qty-btn"
              onClick={handleIncrement}
              disabled={updating}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="xci-subtotal">
          <div className="xci-subtotal-label">Subtotal</div>
          <div className="xci-subtotal-val">{pkr(subtotal)}</div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;